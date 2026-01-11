// MongoDB initialization script
// This script runs when the MongoDB container is first created

// Switch to the church database
db = db.getSiblingDB('church_db');

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
