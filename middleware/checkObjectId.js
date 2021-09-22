const mongoose = require('mongoose');

// middleware to check a valid object id

const checkObjectId = (idCheck) => (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params[idCheck]))
       return res.status(400).json({ msg: 'Invalid ID'});
    next(); 
};

module.exports = checkObjectId;