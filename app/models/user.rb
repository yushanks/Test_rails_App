class User < ApplicationRecord
  has_secure_password
  validates :name, {presence: true}
  validates :email, format: { with: URI::MailTo::EMAIL_REGEXP } 
  def post
    return Post.where(user_id: self.id)
  end
end
