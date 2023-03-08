const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  agent: {
    type: Schema.Types.ObjectId,
    ref: 'Agent',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  organisation: {
    type: Schema.Types.ObjectId,
    ref: 'Organisation',
    required: true
  },
  listingType: {
    type: String,
    required: true
  },
  listingSector: {
    type: String,
    required: true
  },
  unit: {
    bedrooms: {
      type: Number,
      required: true
    },
    bathrooms: {
      type: Number,
      required: true
    },
    parking: {
      type: Number,
      required: true
    },
    price: {
      type: Number,
      required: true
    }
  },
  images: {
    type: [String],
    required: true
  }
});

listingSchema.statics.findByOrganization = async function(organizationId) {
  const listings = await this.find({ organisation: organizationId }).populate('agent');
  return listings;
};

const Listing = mongoose.model('listing', listingSchema);

module.exports = Listing;

