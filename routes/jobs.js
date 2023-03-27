"use strict";

/** Routes for companies. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureLoggedIn } = require("../middleware/auth");
const { ensureAdmin } = require("../middleware/auth");
const Jobs = require("../models/jobs");

const jobNewSchema = require("../schemas/jobsNew");
const jobUpdateSchema = require("../schemas/jobsUpdate.json");

const router = new express.Router();

router.post("/", ensureLoggedIn, ensureAdmin, async function (req, res, next) {
    try {
      const validator = jsonschema.validate(req.body, jobNewSchema);
      if (!validator.valid) {
        const errs = validator.errors.map(e => e.stack);
        throw new BadRequestError(errs);
      }
  
      const Job = await Jobs.create(req.body);
      return res.status(201).json({ job });
    } catch (err) {
      return next(err);
    }
  });

  router.get("/", async function (req, res, next) {
    try {
    const { title, minSalary, hasEquity } = req.query;
      const jobs = await Jobs.findByFilter();
      return res.json({ jobs });
    } catch (err) {
      return next(err);
    }
  });

  router.get("/:handle", async function (req, res, next) {
    try {
      const job = await Jobs.get(req.params.title);
      return res.json({ job });
    } catch (err) {
      return next(err);
    }
  });

  router.patch("/:handle", ensureLoggedIn, ensureAdmin, async function (req, res, next) {
    try {
      const validator = jsonschema.validate(req.body, jobUpdateSchema);
      if (!validator.valid) {
        const errs = validator.errors.map(e => e.stack);
        throw new BadRequestError(errs);
      }
  
      const job = await Jobs.update(req.params.title, req.body);
      return res.json({ job });
    } catch (err) {
      return next(err);
    }
  });

  router.delete("/:handle", ensureLoggedIn, ensureAdmin, async function (req, res, next) {
    try {
      await Jobs.remove(req.params.title);
      return res.json({ deleted: req.params.title });
    } catch (err) {
      return next(err);
    }
  });
  
  
  module.exports = router;