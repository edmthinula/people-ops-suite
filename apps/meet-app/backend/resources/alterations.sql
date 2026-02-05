-- Add a flag to indicate whether a meeting belongs to a recurring series
ALTER TABLE people_ops_suite.meeting
  ADD COLUMN is_recurring BOOLEAN NOT NULL DEFAULT 0
  AFTER wso2_participants;
-- Add a column to store customer name for that particular meeting 
ALTER TABLE people_ops_suite.meeting
  ADD COLUMN customer_name VARCHAR(30) NULL DEFAULT null
  AFTER wso2_participants;