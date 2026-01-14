// MongoDB initialization script
// This script runs when the MongoDB container is first created
// It runs as the root user defined in MONGO_INITDB_ROOT_USERNAME/PASSWORD

// Switch to the church database
db = db.getSiblingDB('church_db');

// Create a dedicated application user for the church_db database
// This is optional - you can also use the root user with authSource=admin
// To use this user, set MONGODB_URI=mongodb://church_app:church_app_password@localhost:27017/church_db
db.createUser({
  user: 'church_app',
  pwd: 'church_app_password',
  roles: [
    { role: 'readWrite', db: 'church_db' },
    { role: 'dbAdmin', db: 'church_db' }
  ]
});

print('Created application user: church_app');

// Create collections with validation
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['email', 'firstName', 'lastName'],
      properties: {
        email: {
          bsonType: 'string',
          description: 'Email is required'
        },
        firstName: {
          bsonType: 'string',
          description: 'First name is required'
        },
        lastName: {
          bsonType: 'string',
          description: 'Last name is required'
        }
      }
    }
  }
});

db.createCollection('events');
db.createCollection('sermons');
db.createCollection('ministries');
db.createCollection('prayerrequests');
db.createCollection('smallgroups');

// Create indexes for better query performance
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ auth0Id: 1 }, { unique: true, sparse: true });
db.users.createIndex({ firstName: 'text', lastName: 'text', email: 'text' });

db.events.createIndex({ startDate: 1, status: 1 });
db.events.createIndex({ slug: 1 }, { unique: true });
db.events.createIndex({ type: 1 });

db.sermons.createIndex({ date: -1 });
db.sermons.createIndex({ slug: 1 }, { unique: true });
db.sermons.createIndex({ title: 'text', description: 'text' });
db.sermons.createIndex({ tags: 1 });

db.ministries.createIndex({ slug: 1 }, { unique: true });
db.ministries.createIndex({ type: 1 });

db.prayerrequests.createIndex({ createdAt: -1 });
db.prayerrequests.createIndex({ visibility: 1, isApproved: 1 });

db.smallgroups.createIndex({ slug: 1 }, { unique: true });

print('Database initialization completed successfully!');
