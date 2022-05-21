const server = require('http').createServer();
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  },
});
const fs = require('fs');
const xlsx = require('xlsx');

const {
  sequelize,
  vehicle,
  vehicleLog,
  person,
  memo,
  watcher,
} = require('./models');

// log file path
const LOG_FILE_PATH = '/src/log.xlsx';

// global log variable
let log = false;

// get the model
function get_model(target) {
  log = false;

  switch (target) {
    case 'vehicle':
      return vehicle;
    case 'vehicle-log':
      log = true;
      return vehicleLog;
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

    /* for logging */
    // if file not exists, create it
    if (log) {
      if (!fs.existsSync(LOG_FILE_PATH)) {
        // log file
        const book = xlsx.utils.book_new();

        const sheet = xlsx.utils.aoa_to_sheet([
          [
            '차량 이름',
            '이름',
            '부서',
            '행선지 및 업무내용',
            '운행일자',
            '출발시간',
            '주행거리(km)',
            '주유량(L)',
            '충전량(만원)',
          ],
        ]);
        xlsx.utils.book_append_sheet(book, sheet, '경산 공장');
        xlsx.utils.book_append_sheet(book, sheet, '부산 공장');

        xlsx.writeFile(book, LOG_FILE_PATH);
      }

      // log
      const book = xlsx.readFile(LOG_FILE_PATH);
      const sheet =
        data.detail.which == '/k/vehicle'
          ? book.Sheets['경산 공장']
          : book.Sheets['부산 공장'];
      xlsx.utils.sheet_add_aoa(
        sheet,
        [
          [
            data.detail.car_name,
            data.detail.name,
            data.detail.dept,
            data.detail.note,
            data.detail.date,
            data.detail.time,
            data.detail.distance,
            data.detail.oil,
            data.detail.hipass,
          ],
        ],
        { origin: -1 },
      );
      xlsx.writeFile(book, LOG_FILE_PATH);
    }

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
