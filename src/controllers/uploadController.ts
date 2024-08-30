import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

// Simulação de um banco de dados em memória
export const measures: Record<
  string,
  {
    customer_code: string;
    measure_value: number;
    measure_type: string;
    confirmed: boolean;
  }
> = {};

export const uploadImage = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { image, customer_code, measure_datetime, measure_type } = req.body;

  // Validação básica dos campos
  if (!image || !customer_code || !measure_datetime || !measure_type) {
    return res.status(400).json({
      error_code: "INVALID_DATA",
      error_description: "Missing required fields",
    });
  }

  // Verifica se o tipo de medição é válido
  if (!["WATER", "GAS"].includes(measure_type.toUpperCase())) {
    return res.status(400).json({
      error_code: "INVALID_TYPE",
      error_description: "Tipo de medição não permitida",
    });
  }

  try {
    console.log("Sending request to Google Vision API...");
    const response = await axios.post(
      `https://vision.googleapis.com/v1/images:annotate?key=${process.env.GEMINI_API_KEY}`,
      {
        requests: [
          {
            image: { content: image },
            features: [{ type: "TEXT_DETECTION" }],
          },
        ],
      }
    );

    // Verifique se a resposta contém dados antes de acessar as propriedades
    const annotations = response.data.responses?.[0]?.textAnnotations;
    if (!annotations || annotations.length === 0) {
      return res.status(500).json({
        error_code: "INTERNAL_ERROR",
        error_description: "No text found in the image",
      });
    }

    // Captura o valor reconhecido pela API
    const measure_value = parseInt(annotations[0].description);
    const measureUUID = uuidv4();
    const imageUrl = `https://example.com/images/${measureUUID}`;

    // Salvar a medição no banco de dados em memória
    measures[measureUUID] = {
      customer_code,
      measure_value,
      measure_type: measure_type.toUpperCase(),
      confirmed: false,
    };

    // Retorna os dados conforme solicitado
    return res.status(200).json({
      image_url: imageUrl,
      measure_value,
      measure_uuid: measureUUID,
    });
  } catch (error: any) {
    console.error(
      "Error processing the image:",
      error?.message || "Unknown error"
    );
    return res.status(500).json({
      error_code: "INTERNAL_ERROR",
      error_description: "An error occurred while processing the image",
    });
  }
};
