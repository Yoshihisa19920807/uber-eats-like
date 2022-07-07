# frozen_string_literal: true

class CreateRestaurants < ActiveRecord::Migration[6.1]
  def change
    create_table :restaurants do |t|
      t.string :name, null: false
      t.integer :fee, null: false, default: 0
      t.integer :delivery_time, null: false, comment: '配送にかかる時間(分)'
      # table.timestamps?
      t.timestamps
    end
  end
end
