const Dev = require('../models/Dev');
const api = require('../services/api');

const parseStringAsArray = require('../utils/parseStringAsArray');

module.exports = {
  async index(req, res) {
    const devs = await Dev.find();

    return res.json(devs);
  },

  async store(req, res) {
    const { github_username, techs, latitude, longitude } = req.body;

    let dev = await Dev.findOne({ github_username });

    if (!dev) {
      const response = await api.get(`/users/${github_username}`);

      const { name = login, avatar_url, bio } = response.data;
      const techsArray = parseStringAsArray(techs);
      
      const location = {
        type: 'Point',
        coordinates: [longitude, latitude],
      };

      dev = await Dev.create({
        github_username,
        name,
        avatar_url,
        bio,
        techs: techsArray,
        location,
      });
    }

    return res.json(dev);
  },
  
  async update(req, res) {
    const { _id } = req.params;
    const { longitude, latitude, techs } = req.body;

    const dev = await Dev.findById(_id);

    if (!dev) {
      return res.status(404).json({ error: { message: 'Dev not found' } })
    }

    const response = await api.get(`/users/${dev.github_username}`);

    const { name = login, avatar_url, bio } = response.data;
    const techsArray = parseStringAsArray(techs);
    
    const location = {
      type: 'Point',
      coordinates: [longitude, latitude],
    };

    await dev.update({
      name,
      avatar_url,
      bio,
      techs: [...dev.techs, ...techsArray],
      location,
    }, {

    });

    const updatedDev = await Dev.findById(_id);

    return res.json(updatedDev);
  },
  
  async destroy(req, res) {
    const { _id } = req.params;

    const dev = await Dev.findById(_id);

    if (!dev) {
      return res.status(404).json({ error: { message: 'Dev not found' } })
    }

    await dev.remove();

    return res.json();
  }
}