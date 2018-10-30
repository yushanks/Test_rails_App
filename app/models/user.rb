class User < ApplicationRecord
  validates :name, {presence: true}
  validates :email, format: { with: URI::MailTo::EMAIL_REGEXP } 
  validates :password, {presence: true}
end
