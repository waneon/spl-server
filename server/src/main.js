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
const K_LOG_FILE_PATH = '/src/경산 공장.xlsx';
const B_LOG_FILE_PATH = '/src/부산 공장.xlsx';

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
        detail: data.detail,
      });
    } catch (e) {
      socket.emit('gets', {
        target: data.target,
        status: 'error',
        value: e,
        detail: data.detail,
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
        detail: data.detail,
      });
    } catch (e) {
      socket.emit('get', {
        target: data.target,
        status: 'error',
        value: e,
        detail: data.detail,
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
        detail: data.detail,
      });
    } catch (e) {
      socket.emit('add', {
        target: data.target,
        status: 'error',
        value: e,
        detail: data.detail,
      });
    }

    /* for logging */
    if (log) {
      // for k, if not exists, create it
      if (!fs.existsSync(K_LOG_FILE_PATH)) {
        const book = xlsx.utils.book_new();
        const sheet = xlsx.utils.aoa_to_sheet([
          [
            '사용자',
            '부서',
            '행선지 및 업무내용',
            '운행일자',
            '출발시간',
            '주행거리(km)',
            '주유(L)',
            '하이패스 충전(만원)',
          ],
        ]);

        let value = await vehicle.findAll({
          where: {
            which: '/k/vehicle',
          },
        });
        value.map((item) => {
          xlsx.utils.book_append_sheet(book, sheet, item.car_name);
        });
        xlsx.writeFile(book, K_LOG_FILE_PATH);
      }

      // for b, if not exists, create it
      if (!fs.existsSync(B_LOG_FILE_PATH)) {
        const book = xlsx.utils.book_new();
        const sheet = xlsx.utils.aoa_to_sheet([
          [
            '사용자',
            '부서',
            '행선지 및 업무내용',
            '운행일자',
            '출발시간',
            '주행거리(km)',
            '주유(L)',
            '하이패스 충전(만원)',
          ],
        ]);

        let value = await vehicle.findAll({
          where: {
            which: '/b/vehicle',
          },
        });
        value.map((item) => {
          xlsx.utils.book_append_sheet(book, sheet, item.car_name);
        });
        xlsx.writeFile(book, B_LOG_FILE_PATH);
      }

      // log
      const book_name =
        data.detail.which == '/k/vehicle' ? K_LOG_FILE_PATH : B_LOG_FILE_PATH;
      const book = xlsx.readFile(book_name);
      const sheet = book.Sheets[data.detail.car_name];
      xlsx.utils.sheet_add_aoa(
        sheet,
        [
          [
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
      xlsx.writeFile(book, book_name);
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
        detail: data.detail,
      });
    } catch (e) {
      socket.emit('delete', {
        target: data.target,
        status: 'error',
        value: e,
        detail: data.detail,
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
        detail: data.detail,
      });
    } catch (e) {
      socket.emit('update', {
        target: data.target,
        status: 'error',
        value: e,
        detail: data.detail,
      });
    }
  });
});

// start server
server.listen(3000, async () => {
  await sequelize.sync();
});
