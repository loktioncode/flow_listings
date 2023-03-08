const axios = require("axios");
const Listing = require("../models/listing");
const Agent = require("../models/agent");
const Organisation = require("../models/organisation");

// Controller function to populate data
const populateData = async (req, res) => {
  try {
    // Retrieve property listings data from the endpoint
    const listingsResponse = await axios.get(
      "https://flow-living-staging.s3.eu-west-1.amazonaws.com/public/assessment/listings.json"
    );
    const listingsData = listingsResponse.data;

    // Retrieve agent data from the endpoint
    const agentsResponse = await axios.get(
      "https://flow-living-staging.s3.eu-west-1.amazonaws.com/public/assessment/agents.json"
    );
    const agentsData = agentsResponse.data;

    // Retrieve organization data from the endpoint
    const orgsResponse = await axios.get(
      "https://flow-living-staging.s3.eu-west-1.amazonaws.com/public/assessment/organisations.json"
    );
    const orgsData = orgsResponse.data;

    // Insert the retrieved data into the database
    const [listingResult, agentsResult, orgsResult] = await Promise.all([
      Agent.insertMany(agentsData),
      Listing.insertMany(listingsData),
      Organisation.insertMany(orgsData)
    ]);
 
    console.log(agentsResult);
    console.log(orgsResult);
    
    res.send("Data inserted successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
};

module.exports = {
  populateData,
};
