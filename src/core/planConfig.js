module.exports = {
  FREE: {
    decisions: 2,
    csvUploads: 1,
    intelligence: "basic"
  },
  PRO: {
    decisions: 50,
    csvUploads: 20,
    intelligence: "standard"
  },
  AGENCY: {
    decisions: 500,
    csvUploads: 200,
    intelligence: "deep"
  },
  ENTERPRISE: {
    decisions: Infinity,
    csvUploads: Infinity,
    intelligence: "full"
  }
};
