class PostsController < ApplicationController
  def index
	@posts = Post.all.order(created_at: :desc)
  end

  def show
  	@post = Post.find_by(id: params[:id])

  end

  def new
  end
end
