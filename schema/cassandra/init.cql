CREATE KEYSPACE IF NOT EXISTS chat_keyspace
WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1};

USE chat_keyspace;

CREATE TABLE message (
    group_id UUID,
    message_id UUID,
    sender_id UUID,
    timestamp TIMESTAMP,
    content TEXT,
    PRIMARY KEY (group_id, timestamp, message_id)
) WITH CLUSTERING ORDER BY (timestamp DESC);
