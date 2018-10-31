class User < ApplicationRecord
  validates :name, {presence: true}
  validates :email, format: { with: URI::MailTo::EMAIL_REGEXP } 
  validates :password, {presence: true}
  def posts
    return Post.where(user_id: self.id)
  end
end
