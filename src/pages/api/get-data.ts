// pages/api/get-data.ts
import { NextApiRequest, NextApiResponse } from "next";
import mysql from "mysql";

const connection = mysql.createConnection({
  host: "ntnuitennis.no",
  user: "anh",
  password: "elektro52",
  database: "tennisgr_web2",
});

connection.connect();

function shuffleArray(array: any[]): any[] {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const number = req.query.number;

    if (!number) {
      res.status(400).json({ error: "Number not provided in the query" });
      return;
    }

    // Wrap connection.query within a new Promise
    const results = await new Promise((resolve, reject) => {
      connection.query('SELECT b.medlemsid, b.fornavn, b.etternavn, b.mobil FROM vikarer a, medlemmer b WHERE a.medlemsid = b.medlemsid AND a.timeid= ? ORDER BY a.bekreftelsestidspunkt', [number], (error, results, fields) => {
        if (error) {
          reject(error);
        } else {
          let dummy = [{"medlemsid":10669,"fornavn":"Lars","etternavn":"Føleide","mobil":"+47 98454499"},{"medlemsid":12197,"fornavn":"Anh","etternavn":"Nguyen Pham","mobil":"97904835"}, {"medlemsid":12345,"fornavn":"Bob","etternavn":"Dahl","mobil":"99745767"}, {"medlemsid":15678,"fornavn":"Alice","etternavn":"Dahl","mobil":"76894556"}];
          results = shuffleArray(dummy);
          resolve(results);
        }
      });
    });

    // Send response after connection.query completes
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching data from the database' });
  }
};

export default handler;
