import { createConnection, Connection } from 'typeorm';
import { Ticket } from '../app/models/ticket.model';
import { User } from '../app/user/models/user.model';
import { Notice } from '../app/models/notice.model';
import { Photo } from '../app/models/photo.model';

describe('Index models test', () => {
  let connection: Connection;

  beforeAll(async () => {
    connection = await createConnection('test');
  });

  describe('User model', () => {

    const defaultUserFields = {
      username: 'anton',
      password: 'hash',
      role: 'admin',
    } as Partial<User>;

    describe('should create user', () => {
      test('with default values', async () => {
        const user = new User(defaultUserFields);
        await expect(connection.manager.save(user)).resolves.toBeInstanceOf(User);
        const saved = await connection.getRepository<User>(User).findOne();
        expect(saved.username).toEqual('anton');
        // Check that we are not showing password
        expect(saved.password).toEqual(undefined);
        expect(saved.role).toEqual('admin');
      });

      test('with personal information', async () => {
        const user = new User({
          ...defaultUserFields,
          username: 'anton2',
          personalInfo: {
            firstName: 'Anton',
            lastName: 'Iatsenko',
            email: 'ai@ai.com',
            phone: '',
            photo: '',
          },
        });
        const result = await connection.manager.save(user);
        expect(result).toBeInstanceOf(User);
        const saved = await connection.getRepository<User>(User).findOne(result.id);
        expect(saved.username).toEqual('anton2');
        expect(saved.personalInfo.firstName).toEqual('Anton');
        expect(saved.personalInfo.lastName).toEqual('Iatsenko');
        expect(saved.personalInfo.email).toEqual('ai@ai.com');
      });
    });

    describe('should not create user', () => {
      test('with the same login', async () => {
        const user = new User(defaultUserFields);
        await expect(connection.manager.save(user)).rejects.toThrowError();
      });

      test('all empty fields', async () => {
        const user = new User();
        await expect(connection.manager.save(user)).rejects.toThrowError();
      });
      test('no username', async () => {
        const copy = {...defaultUserFields};
        delete copy.username;
        const user = new User(copy);
        await expect(connection.manager.save(user)).rejects.toThrowError();
      });
      test('no password', async () => {
        const copy = {...defaultUserFields};
        delete copy.password;
        const user = new User(copy);
        await expect(connection.manager.save(user)).rejects.toThrowError();
      });
      test('no role', async () => {
        const copy = {...defaultUserFields};
        delete copy.role;
        const user = new User(copy);
        await expect(connection.manager.save(user)).rejects.toThrowError();
      });
      test('the same user', async () => {
        const user = new User(defaultUserFields);
        await expect(connection.manager.save(user)).rejects.toThrowError();
      });
    });
  });

  describe('Photo model', () => {
    test('should create photo', async () => {
      const photo = new Photo({
        content: '123123123123',
        recognitionData: null,
      });
      const saved = await connection.manager.save(photo);
      expect(saved).toBeInstanceOf(Photo);
      expect(saved.content).toEqual('123123123123');
      expect(saved.recognitionData).toEqual(null);
    });
    test('should create photo with recognitionData', async () => {
      const photo = new Photo({
        content: '123123123123',
        recognitionData: {a: 2, b: 3, x: 'lol'},
      });
      const saved = await connection.manager.save(photo);
      expect(saved).toBeInstanceOf(Photo);
      expect(saved.content).toEqual('123123123123');
      expect(saved.recognitionData).toEqual({a: 2, b: 3, x: 'lol'});
    });
  });

  describe('Notice model', () => {
    const defaultNoticeFields = {
      vehicleInfo: {
        licensePlates: 'BC8016EX',
        make: 'Ford',
        model: 'Ranger',
      },
      address: 'street 7',
      violations: ['a1', 'b2', 'c3'],
      amount: 255.55,
    } as Partial<Notice>;

    describe('should create notice', () => {
      test('with default values', async () => {
        const notice = new Notice(defaultNoticeFields);
        await expect(connection.manager.save(notice)).resolves.toBeInstanceOf(Notice);
        const saved = await connection.getRepository<Notice>(Notice).findOne();
        expect(saved.vehicleInfo.licensePlates).toEqual('BC8016EX');
        expect(saved.vehicleInfo.make).toEqual('Ford');
        expect(saved.vehicleInfo.model).toEqual('Ranger');
        expect(saved.address).toEqual('street 7');
        expect(saved.violations).toEqual(['a1', 'b2', 'c3']);
        expect(saved.amount).toEqual(255.55);
      });
    });

    describe('should not create notice', () => {
      test('no vehicleInfo', async () => {
        const copy = {...defaultNoticeFields};
        delete copy.vehicleInfo;
        const notice = new Notice(copy);
        await expect(connection.manager.save(notice)).rejects.toThrowError();
      });
      test('no plates', async () => {
        const copy = {...defaultNoticeFields, vehicleInfo: {...defaultNoticeFields.vehicleInfo}};
        delete copy.vehicleInfo.licensePlates;
        const notice = new Notice(copy);
        await expect(connection.manager.save(notice)).rejects.toThrowError();
      });
      test('no make', async () => {
        const copy = {...defaultNoticeFields, vehicleInfo: {...defaultNoticeFields.vehicleInfo}};
        delete copy.vehicleInfo.make;
        const notice = new Notice(copy);
        await expect(connection.manager.save(notice)).rejects.toThrowError();
      });
      test('no model', async () => {
        const copy = {...defaultNoticeFields, vehicleInfo: {...defaultNoticeFields.vehicleInfo}};
        delete copy.vehicleInfo.model;
        const notice = new Notice(copy);
        await expect(connection.manager.save(notice)).rejects.toThrowError();
      });
      test('no address', async () => {
        const copy = {...defaultNoticeFields, vehicleInfo: {...defaultNoticeFields.vehicleInfo}};
        delete copy.address;
        const notice = new Notice(copy);
        await expect(connection.manager.save(notice)).rejects.toThrowError();
      });
      test('no amount', async () => {
        const copy = {...defaultNoticeFields, vehicleInfo: {...defaultNoticeFields.vehicleInfo}};
        delete copy.amount;
        const notice = new Notice(copy);
        await expect(connection.manager.save(notice)).rejects.toThrowError();
      });
      test('no violations', async () => {
        const copy = {...defaultNoticeFields, vehicleInfo: {...defaultNoticeFields.vehicleInfo}};
        delete copy.violations;
        const notice = new Notice(copy);
        await expect(connection.manager.save(notice)).rejects.toThrowError();
      });
    });
  });

  describe('Should assign photo to notice', () => {
    test('notice has photos', async () => {
      const photo = await connection.getRepository<Photo>(Photo).findOne();
      const notice = await connection.getRepository<Notice>(Notice).findOne();
      notice.photos = [photo];
      const saved = await connection.manager.save(notice);
      expect(saved.photos.length).toEqual(1);
      expect(saved.photos[0]).toEqual(photo);
    });
    test('photo have notice', async () => {
      const photo = await connection.getRepository<Photo>(Photo).findOne({relations: ['notice']});
      const notice = await connection.getRepository<Notice>(Notice).findOne();
      expect(photo.notice).toBeInstanceOf(Notice);
      expect(photo.notice.id).toEqual(notice.id);
    });
  });

  describe('Ticket model', () => {
    let notice;
    let defaultTicketFields: Partial<Ticket>;
    beforeAll(async () => {
      notice = await connection.getRepository<Notice>(Notice).findOne();
      defaultTicketFields = {
        notice,
        vehicleInfo: {
          licensePlates: 'BC8016EX',
          make: 'Ford',
          model: 'Ranger',
        },
        address: 'street 7',
        violations: ['a1', 'b2', 'c3'],
        amount: 255.55,
      };
    });
    describe('should create ticket', () => {
      test('with default values', async () => {
        const ticket = new Ticket(defaultTicketFields);
        await expect(connection.manager.save(ticket)).resolves.toBeInstanceOf(Ticket);
        const saved = await connection.getRepository<Ticket>(Ticket).findOne({relations: ['notice']});
        expect(saved.notice).toEqual(notice);
        expect(saved.vehicleInfo.licensePlates).toEqual('BC8016EX');
        expect(saved.vehicleInfo.make).toEqual('Ford');
        expect(saved.vehicleInfo.model).toEqual('Ranger');
        expect(saved.address).toEqual('street 7');
        expect(saved.violations).toEqual(['a1', 'b2', 'c3']);
        expect(saved.amount).toEqual(255.55);
      });
    });
    describe('should not create ticket', () => {
      test('without notice', async () => {
        const copy = {...defaultTicketFields};
        delete copy.notice;
        await expect(connection.manager.save(copy)).rejects.toThrowError();
      });
      test('no vehicleInfo', async () => {
        const copy = {...defaultTicketFields};
        delete copy.vehicleInfo;
        const notice = new Notice(copy);
        await expect(connection.manager.save(notice)).rejects.toThrowError();
      });
      test('no plates', async () => {
        const copy = {...defaultTicketFields, vehicleInfo: {...defaultTicketFields.vehicleInfo}};
        delete copy.vehicleInfo.licensePlates;
        const notice = new Notice(copy);
        await expect(connection.manager.save(notice)).rejects.toThrowError();
      });
      test('no make', async () => {
        const copy = {...defaultTicketFields, vehicleInfo: {...defaultTicketFields.vehicleInfo}};
        delete copy.vehicleInfo.make;
        const notice = new Notice(copy);
        await expect(connection.manager.save(notice)).rejects.toThrowError();
      });
      test('no model', async () => {
        const copy = {...defaultTicketFields, vehicleInfo: {...defaultTicketFields.vehicleInfo}};
        delete copy.vehicleInfo.model;
        const notice = new Notice(copy);
        await expect(connection.manager.save(notice)).rejects.toThrowError();
      });
      test('no address', async () => {
        const copy = {...defaultTicketFields, vehicleInfo: {...defaultTicketFields.vehicleInfo}};
        delete copy.address;
        const notice = new Notice(copy);
        await expect(connection.manager.save(notice)).rejects.toThrowError();
      });
      test('no amount', async () => {
        const copy = {...defaultTicketFields, vehicleInfo: {...defaultTicketFields.vehicleInfo}};
        delete copy.amount;
        const notice = new Notice(copy);
        await expect(connection.manager.save(notice)).rejects.toThrowError();
      });
      test('no violations', async () => {
        const copy = {...defaultTicketFields, vehicleInfo: {...defaultTicketFields.vehicleInfo}};
        delete copy.violations;
        const notice = new Notice(copy);
        await expect(connection.manager.save(notice)).rejects.toThrowError();
      });
    });
  });
});
