CREATE TABLE "user" (
    id UUID PRIMARY KEY,
    username VARCHAR,
    email VARCHAR,
    phone_number VARCHAR,
    "2fa" BOOLEAN,
    password_hash VARCHAR,
    profile_pic VARCHAR, -- Link to pfp img
    bio TEXT,            -- Short text about the user
    created_at TIMESTAMP
);

CREATE TABLE "group" (
    id UUID PRIMARY KEY,
    name VARCHAR,
    description TEXT,    -- Description of group
    created_at TIMESTAMP,
    created_by UUID,
    is_dm BOOLEAN,
    CONSTRAINT fk_group_created_by FOREIGN KEY (created_by) REFERENCES "user" (id)
);

CREATE TABLE group_member (
    user_id UUID,
    group_id UUID,
    joined_at TIMESTAMP,
    role VARCHAR,        -- Admin / staff etc
    PRIMARY KEY (user_id, group_id),
    CONSTRAINT fk_member_user FOREIGN KEY (user_id) REFERENCES "user" (id),
    CONSTRAINT fk_member_group FOREIGN KEY (group_id) REFERENCES "group" (id)
);
