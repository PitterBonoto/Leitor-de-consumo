import { Request, Response } from "express";
// Importa o banco de dados em memória compartilhado
import { measures } from "./uploadController";

export const listMeasures = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { customer_code } = req.params;
  const { measure_type } = req.query;

  // Filtra as medições pelo código do cliente e, opcionalmente, pelo tipo de medição
  const customerMeasures = Object.entries(measures)
    .filter(([_, measure]) => measure.customer_code === customer_code)
    .filter(
      ([_, measure]) => !measure_type || measure.measure_type === measure_type
    )
    .map(([measure_uuid, measure]) => ({
      measure_uuid,
      measure_value: measure.measure_value,
      measure_type: measure.measure_type,
      confirmed: measure.confirmed,
    }));

  return res.status(200).json({
    customer_code,
    measures: customerMeasures,
  });
};
