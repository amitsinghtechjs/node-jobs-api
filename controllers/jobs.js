const Job = require('../models/Job');
const { NotFoundError, BadRequestError } = require('../errors');
const { StatusCodes } = require('http-status-codes');

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userId }).sort(
    '-createdAt'
  );
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};

const getJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;
  const job = await Job.findOne({ createdBy: userId, _id: jobId });
  if (!job) throw new NotFoundError(`No job found with id ${jobId}`);
  res.status(StatusCodes.OK).json({ job });
};

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

const updateJob = async (req, res) => {
  const {
    user: { userId },
    body: payload,
    body: { company, position },
    params: { id: jobId },
  } = req;

  if (!company || !position)
    throw new BadRequestError('Company and postion are mandatory');
  const job = await Job.findOneAndUpdate(
    { _id: jobId, createdBy: userId },
    payload,
    { new: true }
  );

  if (!job) throw new NotFoundError(`No job found with id ${jobId}`);

  res.status(StatusCodes.OK).json({ job });
};

const deleteJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;
  const job = await Job.findOneAndRemove({ _id: jobId, createdBy: userId });
  console.log('AAAA', job);
  if (!job)
    throw new BadRequestError(`No job found with id ${userId} to be deleted`);
  res.status(StatusCodes.OK).send();
};

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
};
