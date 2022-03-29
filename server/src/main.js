const server = require('http').createServer();
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  },
});

const { sequelize, vehicle, person, memo, watcher } = require('./models');

// get the model
function get_model(target) {
  switch (target) {
    case 'vehicle':
      return vehicle;
    case 'person':
      return person;
    case 'memo':
      return memo;
    case 'watcher':
      return watcher;
    default:
      return null;
  }
}

// socket callbacks
io.on('connection', (socket) => {
  // gets
  socket.on('gets', async (data) => {
    const model = get_model(data.target);

    try {
      if (model == null) {
        throw new Error('unknown method');
      }

      let value = await model.findAll({
        where: data.detail,
      });

      socket.emit('gets', {
        target: data.target,
        status: 'ok',
        value,
      });
    } catch (e) {
      socket.emit('gets', {
        target: data.target,
        status: 'error',
        value: e,
      });
    }
  });

  // get
  socket.on('get', async (data) => {
    const model = get_model(data.target);

    try {
      if (model == null) {
        throw new Error('unknown method');
      }

      let value = await model.findOne({
        where: data.detail,
      });

      socket.emit('get', {
        target: data.target,
        status: 'ok',
        value,
      });
    } catch (e) {
      socket.emit('get', {
        target: data.target,
        status: 'error',
        value: e,
      });
    }
  });

  // add
  socket.on('add', async (data) => {
    const model = get_model(data.target);

    try {
      if (model == null) {
        throw new Error('unknown method');
      }

      let value = await model.create(data.detail);

      io.emit('add', {
        target: data.target,
        status: 'ok',
        value,
      });
    } catch (e) {
      socket.emit('add', {
        target: data.target,
        status: 'error',
        value: e,
      });
    }
  });

  // delete
  socket.on('delete', async (data) => {
    const model = get_model(data.target);

    try {
      if (model == null) {
        throw new Error('unknown method');
      }

      let value = await model.findOne({
        where: data.detail,
      });
      await model.destroy({
        where: data.detail,
      });

      io.emit('delete', {
        target: data.target,
        status: 'ok',
        value,
      });
    } catch (e) {
      socket.emit('delete', {
        target: data.target,
        status: 'error',
        value: e,
      });
    }
  });

  // update
  socket.on('update', async (data) => {
    const model = get_model(data.target);

    try {
      if (model == null) {
        throw new Error('unknown method');
      }

      await model.update(data.detail, {
        where: {
          key: data.detail.key,
        },
      });
      let value = await model.findOne({
        where: data.detail,
      });

      io.emit('update', {
        target: data.target,
        status: 'ok',
        value,
      });
    } catch (e) {
      socket.emit('update', {
        target: data.target,
        status: 'error',
        value: e,
      });
    }
  });
});

// start server
server.listen(3000, async () => {
  await sequelize.sync();
});
