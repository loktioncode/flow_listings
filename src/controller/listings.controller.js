
const Listing = require("../models/listing");
const Agent = require("../models/agent");
// const Organisation = require("../models/organisation");

const getAgentListings = async (req, res) => {
  const agentId = req.params.agentId;
  try {
    const listings = await Listing.find({ agent: agentId });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getOrgListing = async (req, res) => {
  try {
    const organizationId = req.params.organizationId;
    const listings = await Listing.find({ organisation: organizationId });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getOrgAgent = async (req, res) => {
  try {
    const organizationId = req.params.organizationId;
    const listings = await Listing.find({ organisation: organizationId });
    const agentIds = listings.map((listing) => listing.agent);
    const agents = await Agent.find({ _id: { $in: agentIds } });
    //to be updated to agents
    res.json(agentIds);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getOrgAgent,
  getAgentListings,
  getOrgListing,
};
