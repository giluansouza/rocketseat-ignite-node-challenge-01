// Função para construir uma expressão regular a partir de um caminho de rota
export function buildRoutePath(path) {
  // Expressão regular para identificar parâmetros de rota no formato :nomeDoParametro
  const routeParametersRegex = /:([a-zA-Z]+)/g;

  // Substituir os parâmetros de rota por grupos de captura na expressão regular
  const paramsWithParams = path.replaceAll(routeParametersRegex, '(?<$1>[a-z0-9\-_]+)');

  // Construir a expressão regular completa para validar o caminho da rota
  // Ela inclui os parâmetros da rota e opcionalmente a parte de consulta (?querystring)
  const pathRegex = new RegExp(`^${paramsWithParams}(?<query>\\?(.*))?$`);

  // Retornar a expressão regular construída
  return pathRegex;
}
