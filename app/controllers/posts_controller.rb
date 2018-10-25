class PostsController < ApplicationController
  def index
    
    @posts = [
      "今日からProgateでRailsの勉強",
      "投稿一覧ページ作成中！"
    ]
  end
end
