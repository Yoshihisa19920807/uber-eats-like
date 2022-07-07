# frozen_string_literal: true

# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
Restaurant.destroy_all
3.times do |n|
  restaurant = Restaurant.new(
    name: "レストラン#{n}",
    fee: 500,
    delivery_time: 10
  )

  12.times do |m|
    restaurant.foods.build(
      name: "フード#{n}",
      price: 600,
      description: "フード_#{m}の説明文です。"
    )
  end
  restaurant.save!
end
