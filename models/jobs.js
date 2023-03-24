"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

class Jobs {
    static async create({ title, salary, equity, company_handle }) {
        const duplicateCheck = await db.query(
              `SELECT title
               FROM jobs
               WHERE title = $1`,
            [title]);
    
        if (duplicateCheck.rows[0])
          throw new BadRequestError(`Duplicate job: ${title}`);
    
        const result = await db.query(
              `INSERT INTO jobs
               (title, salary, equity, company_handle)
               VALUES ($1, $2, $3, $4)
               RETURNING title, salary, equity, company_handle`,
            [
                title,
                salary,
                equity, 
                company_handle
            ],
        );
        const job = result.rows[0];
    
        return job;
      }

      static async findAll() {
        const jobsRes = await db.query(
              `SELECT title,
                      salary,
                      equity,
                     company_handle
               FROM jobs
               ORDER BY title`);
        return jobssRes.rows;
      }

      static async findByFilter() {
        const values = [];
        const filters = [];
    
        if(title) {
          filter.push("LOWER(title) LIKE $1");
          values.push(`%{title.toLowerCase()}%`);
        }
    
        if(minSalary) {
          filter.push("salary >= $2");
          values.push(parseInt(minSalary));
        }

        if(hasEquity) {
            filter.push("equity > 0");
            values.push(parseInt(hasEquity))
        }
    
        const jobsRes = await db.query(
              `SELECT title,
              salary,
              equity,
              company_handle
              FROM jobs
              WHERE ${filters.join(" AND ")}
              ORDER BY title`);
    
            return jobsRes.rows;
      };

      static async update(title, data) {
        const { setCols, values } = sqlForPartialUpdate(
            data,
            {
              salary: "salary",
              equity: "equity",
            });
        const handleVarIdx = "$" + (values.length + 1);
    
        const querySql = `UPDATE jobs 
                          SET ${setCols} 
                          WHERE handle = ${handleVarIdx} 
                          RETURNING       title,
                          salary,
                          equity,
                          company_handle`;
        const result = await db.query(querySql, [...values, handle]);
        const job = result.rows[0];
    
        if (!job) throw new NotFoundError(`No job: ${title}`);
    
        return job;
      }
    

      static async remove(title) {
        const result = await db.query(
              `DELETE
               FROM jobs
               WHERE title = $1
               RETURNING title`,
            [title]);
        const job = result.rows[0];
    
        if (!job) throw new NotFoundError(`No job: ${title}`);
      }
}

module.exports = Jobs;