/*
  # Create inventory table

  1. New Tables
    - `inventory`
      - `id` (bigint, primary key)
      - `name` (text)
      - `type` (text)
      - `quantity` (integer)
      - `unit` (text)
      - `min_quantity` (integer)
      - `status` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `inventory` table
    - Add policy for authenticated users to read and modify their own data
*/

CREATE TABLE IF NOT EXISTS inventory (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name text NOT NULL,
  type text NOT NULL,
  quantity integer NOT NULL DEFAULT 0,
  unit text NOT NULL,
  min_quantity integer NOT NULL DEFAULT 10,
  status text NOT NULL DEFAULT 'In Stock',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read inventory"
  ON inventory
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert inventory"
  ON inventory
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update inventory"
  ON inventory
  FOR UPDATE
  TO authenticated
  USING (true);