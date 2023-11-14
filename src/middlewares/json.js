// Função assíncrona para processar dados JSON a partir de uma requisição HTTP
export async function json(req, res) {
  // Um array para armazenar pedaços (buffers) de dados da requisição
  const buffers = [];

  // Loop assíncrono para iterar sobre os pedaços de dados da requisição
  for await (const chunk of req) {
    // Adiciona cada pedaço ao array de buffers
    buffers.push(chunk);
  }

  try {
    // Tenta analisar e converter os dados acumulados em JSON
    req.body = JSON.parse(Buffer.concat(buffers).toString());
  } catch {
    // Se houver um erro ao analisar o JSON, define req.body como null
    req.body = null;
  }

  // Configura o cabeçalho da resposta para indicar que o conteúdo é JSON
  res.setHeader('Content-Type', 'application/json');
}
