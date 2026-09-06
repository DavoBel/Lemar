export function ofertaToJSON(oferta) {
  const { titularidad_propia, vtv_al_dia, documentacion_completa, tiene_multas, ...resto } =
    oferta;

  return {
    ...resto,
    titularidad: titularidad_propia ? "propio" : "tercero",
    vtv: vtv_al_dia ? "al_dia" : "vencida",
    documentacion: documentacion_completa ? "completa" : "incompleta",
    multas: tiene_multas ? "si" : "no",
  };
}

export function ofertaFromJSON(body) {
  const { titularidad, vtv, documentacion, multas, ...resto } = body;

  return {
    ...resto,
    titularidad_propia: titularidad === "propio",
    vtv_al_dia: vtv === "al_dia",
    documentacion_completa: documentacion === "completa",
    tiene_multas: multas === "si",
  };
}
