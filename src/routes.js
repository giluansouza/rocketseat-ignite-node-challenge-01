import { randomUUID } from 'node:crypto'
import { Database } from './database.js'
import { buildRoutePath } from './utils/build-route-path.js'

import assert from 'assert';
import { createReadStream } from 'fs';
import { parse } from 'csv-parse';
import { TasksCSV } from './tasks.js';

const database = new Database()
const tasksCSV = new TasksCSV()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query

      const tasks = database.select('tasks', search ? { description: search } : null)

      return res.end(JSON.stringify(tasks))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description, completed_at } = req.body

      if (!title || !description) {
        return res.writeHead(400)
        .end(JSON.stringify({
          message: 'O título e a descrição são obrigatórios'
        }))
      }
      
      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at,
        created_at: new Date(),
        updated_at: new Date()
      }

      database.insert('tasks', task)

      return res.writeHead(201).end()
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const { title, description } = req.body

      if (!title || !description) {
        return res.writeHead(400)
        .end(JSON.stringify({
          message: 'O título e a descrição são obrigatórios'
        }))
      }

      const task = {
        title,
        description,
        updated_at: new Date()
      }

      const result = database.update('tasks', id, task)

      if(!result) {
        return res.writeHead(404).end("Task não encontrada!")
      }

      return res.writeHead(204).end()
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      const result = database.delete('tasks', id)

      if(!result) {
        return res.writeHead(404).end("Task não encontrada!")
      }

      return res.writeHead(204).end()
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params
      const { completed_at } = req.body

      const task = {
        completed_at,
        updated_at: new Date()
      }

      const result = database.update('tasks', id, task)

      if(!result) {
        return res.writeHead(404).end("Task não encontrada!")
      }

      return res.writeHead(200).end()
    }
  },
  {
    method: 'GET',
    path: buildRoutePath('/tasks/csv'),
    handler: async (req, res) => {
      
      const filePath = new URL('../tasks.csv', import.meta.url)

      tasksCSV.parseCSV(filePath)
      .then((records) => {
        // Percorrer recoders
        records.forEach((record) => {
          const task = {
            id: randomUUID(),
            title: record[0],
            description: record[1],
            created_at: new Date(),
            updated_at: new Date()
          }
          
          database.insert('tasks', task)
        })
      })
      .catch((err) => {
        console.error('Erro ao processar o arquivo CSV:', err);
      });

      return res.writeHead(204).end()
    }
  },
]