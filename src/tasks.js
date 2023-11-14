import { createReadStream } from 'fs';
import { parse } from 'csv-parse';

export class TasksCSV {
  parseCSV(filePath) {
    return new Promise((resolve, reject) => {
      const records = [];

      // Crie um stream de leitura para o arquivo CSV
      const stream = createReadStream(filePath);

      // Inicialize o parser
      const parser = parse({
        delimiter: ','
      });

      // Variável de controle para pular a primeira linha
      let firstLine = true;

      // Usar a API de stream legível para consumir os registros
      parser.on('readable', function () {
        let record;
        while ((record = parser.read()) !== null) {
          if (firstLine) {
            firstLine = false
            continue
          }

          records.push(record)
        }
      });

      parser.on('error', function (err) {
        reject(err);
      });

      parser.on('end', function () {
        resolve(records);
      });

      // Pipe o stream de leitura para o parser
      stream.pipe(parser);
    })
  }
}
