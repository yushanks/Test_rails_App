class User < ApplicationRecord
  validates :name, {presence: true}
  validates :email, format: { with: URI::MailTo::EMAIL_REGEXP } 
  has_secure_password
  def post
    return Post.where(user_id: self.id)
  end
end
