# Rails 環境構築　自分仕様

以下自分仕様のRailsの環境構築設定が定まったので，ここに記載する．
ポイントはここ
* Rbenvを用いてRubyのバージョン管理をする
* HerokuにWebアプリをデプロイする
* Ruby環境下にGemをインストールしたくないため，プロジェクトごとののローカルディレクトリにインストールし，管理．
* rbenv bundle exec でRailsを動かすことで，Gitでの管理が楽になる
* RailsもRuby環境下に入れずプロジェクトvendor/bundle以下にインストール

---


## rbenv、Rubyのインストール
rbenvとそのプラグインruby-buildをインストールする。

```
$ git clone git://github.com/sstephenson/rbenv.git ~/.rbenv
$ mkdir -p ~/.rbenv/plugins
$ git clone https://github.com/sstephenson/ruby-build.git ~/.rbenv/plugins/ruby-build
```
rbenv用の以下の設定を .bash_profile に設定する。
```
export PATH="$HOME/.rbenv/bin:$PATH"
eval "$(rbenv init -)"
```
書き換えた .bash_profile の設定を読み込む。
```
$ source ~/.bash_profile
```




OpenSSLをインストールしないとrbenv環境での bundle install が失敗するらしいので、HomebrewでOpenSSLをインストールする。
```
$ brew install openssl
```
readlineとiconvがないと動かないgemがあるらしいので、Homebrewでこの二つをインストール。
```
$ brew install readline
$ brew install libiconv
```
インストール可能なRubyのバージョンを調べる。
```
$ rbenv install -l
```
Homebrew で インストールした openssl、readline、iconv のパスを教えて、rbenv でRubyをインストール。
```
RUBY_CONFIGURE_OPTS="--with-readline-dir=$(brew --prefix readline) --with-openssl-dir=$(brew --prefix openssl) --with-iconv-dir=$(brew --prefix libiconv) --with-libxml2-dir=$(brew --prefix libxml2)" rbenv install 2.5.2

$ rbenv rehash¥
```
以下のコマンドで、インストールしたRubyのバージョンのリストを確認できる
```
$ rbenv versions
```
インストールしたRubyを有効にする
```
$ rbenv global 2.5.2
```

SSL証明書のインポート
ここまでの状態のRubyだと、SSL通信を行う処理をしようとした時に、
```
/Users/hoge/.rbenv/versions/2.0.0-p195/lib/ruby/2.0.0/net/http.rb:918:in `connect': SSL_connect returned=1 errno=0 state=SSLv3 read server certificate B: certificate verify failed (Twitter::Error::ClientError)
````
というエラーが起きる。そこで、対策として証明書をセットアップします。

まずは、証明書のパスを確認し、
```
$ ruby -ropenssl -e "p OpenSSL::X509::DEFAULT_CERT_FILE"
```
返ってきたパスに対して、証明書をダウンロード。
```
$ sudo curl "https://curl.haxx.se/ca/cacert.pem" -o /usr/local/etc/openssl/cert.pem
```

## #Bundlerのインストール
Railsで利用するGemは各プロジェクト毎にbundlerで管理するようにしたいので

GEMでRuby環境にbundlerのみをインストール
bundlerを使って一時的にrailsをローカルにインストール （Railsプロジェクトを作成するためだけに使用。railsすらローカルディレクトリにインストールする）
ローカルのrailsでプロジェクト(今回の例では”example”)を作成
railsをローカルインストールするために使ったbundlerの環境を削除
exampleプロジェクト内で必要なgemをbundlerでローカルインストール
という手順を踏む。でははじめよう。

GEMでRuby環境にbundlerのみをインストールする。


```
$ rbenv exec gem install bundler
$ rbenv rehash

```
ちなみに現在有効なrubyにインストールされたgemの確認は以下のコマンドで行う。
```
$ rbenv exec gem 
```
インストールしたgemパッケージの保存場所を調べるには以下のコマンドを使う。
```
$ rbenv exec gem which bundler
```


## RailsのローカルインストールとRailsプロジェクトの作成
（新規Railsプロジェクトを作る時は、常にこのステップから行う）

bundlerを使って一時的にrailsをローカルにインストール。（Railsプロジェクトを作成するためだけに使用。railsすらローカルディレクトリにインストールする）
まず、Railsプロジェクトを作りたいディレクトリに移動して、そこで Gemfile を作る。

```
$ cat << EOS > Gemfile
source "http://rubygems.org"
gem "rails", "4.1.1" # ←ローカルインストールしたいRailsのバージョンを指定。指定しなければ最新版が入る。
EOS

```




```

現在の構図
Rails_App/first_webapp
          Heroku_App
          Gemfile
```

railsを vender/bundle ディレクトリ以下にインストールする。
ここが問題か？
rubyのバージョンが2.3なんちゃらになってしまう
rbenvを使わないとシステムのbundleを使って，インストールされてしまう
下のは間違え
参考サイトは`bundle`と記述することで，システムのRubyを用いている
```
$ bundle install --path vendor/bundle

```

正解は
```
rbenv exec bundle install --path vendor/bundle 
```

```
rbenv exec bundle install --path vendor/bundle  -- --use-system-libraries --with-iconv-dir="$(brew --prefix libiconv)" --with-xml2-config="$(brew --prefix libxml2)/bin/xml2-config" --with-xslt-config="$(brew --prefix libxslt)/bin/xslt-config"


```


````
An error occurred while installing nokogiri (1.8.5), and Bundler cannot
continue.
Make sure that `gem install nokogiri -v '1.8.5' --source 'http://rubygems.org/'` succeeds
before bundling.
````
というエラがー出てしまった？nokogiriのインストール失敗
[stackoverflow](https://stackoverflow.com/questions/47038472/nokogiri-v-1-8-1-issue-when-running-bundle-install)調べたら，`brew install libxml2`~~で解決するみたい~~　解決しません
```
brew unlink xz ##xzパッケージ無効
gem install nokogiri
brew link xz
```
もしかしたら，rbenvにbrewのlibxml2のパスがわかってないのではと思い以下コマンド実行
```
rbenv exec bundle install --path vendor/bundle RUBY_CONFIGURE_OPTS="--with-libxml2-dir=$(brew --prefix libxml2)" 
```
で治るみたいに書いてあったのでやってみる

linkはbrewのパッケージ有効のコマンドみたい
←解決しません



BundlerにNokogiriビルド時のオプションとして、--use-system-librariesと--with-xml2-includeを設定します。

```
rbenv exec bundle config build.nokogiri --use-system-libraries --with-xml2-include=$(brew --prefix libxml2)/include/libxml2

```
この設定を行った状態でbundle installすればエラーが発生しなくなるみたい．






railsでWebApp(今回の例では”first_webapp”)を作成。

rbenvを入れないとシステムのbundleを使ってしまう
```
$ rbenv exec bundle exec rails new first_webapp --skip-bundle
```
（ vendor/bundle に入ったgemを使ってコマンドを実行したい場合は上記のように bundle exec 〜 のようにする）
（ --skip-bundle の指定を忘れないように！そうでないと bundle install が発動し、Ruby環境にgemがインストールされてしまう！）


railsをローカルインストールするために使ったbundlerの環境と、ローカルのrailsを削除する。
```
$ rm -f Gemfile
$ rm -f Gemfile.lock
$ rm -rf .bundle
$ rm -rf vendor/bundle
```
以上コマンドをシェルスクリプトにまとめる(remove_gems.sh)
chmod +xでシェルスクリプトに権限を与えるのを忘れないように
```
chmod +x remove_gems.sh
./remove_gems.sh
```
## Rubyのバージョン設定
```
$ cd first_webapp
```
`.ruby-version`，`Gemfile`,というファイルにRubyのバージョンが書かれている
私が使っているRubyのバージョンは2.5.2のなので，書き換える




## Railsプロジェクトの環境セットアップ
必要に応じて、example内のGemfileの内容を編集する（Rspecとか、Guardとか、色々入れるよね）。

次に、example内に移動し、Gemfileに書かれたGemのインストールを行う。
この際も --path vendor/bundle オプションをつけて bundle install することでプロジェクト内に閉じた状態でGemをインストールすることができる。
```
$ rbenv exec bundle install --path vendor/bundle
```

vendor/bundleディレクトリにあるGemsは容量を食うのでGitリポジトリに入れたくないので以下のように
* GemfileやGemfile.lockファイルはGitの管理対象なので、cloneした人はそれをもとにbundle install --path vendor/bundleすれば、簡単に同じGem環境を導入できる。
```
$ echo '/vendor/bundle' >> .gitignore
```



## Webアプリの作成
~~今回はProgateのアプリを参考にWebAppを作成するので，名前は同じにしてみた．~~
だめ，同じフォルダ名にしたいといけないみたい
そもそも，アプリ作成してた笑

```
pwd
Rails_Apps/first_webapp
```

```
rbenv exec bundle exec rails generate controller home top
```

```
rbenv exec bundle exec rake db:migrate
```

```
rbenv exec bundle exec rails s
```

これで起動できてるか確認しよう
http://localhost:3000/top
まだ何も作成していないので，エラーがでる
## herokuにデプロイする設定
### heroku用のGemをインストール
herokuにデプロイする準備をします。
herokuで公開するためにはGemfileを以下のように書き換える必要。

```
gem 'sqlite3', group: :development
gem 'pg', group: :production
```

herokuにデプロイするためには，PostgreSQLを使う必要がある

PostgreSQLがインストールできていなかったら
```
brew install postgresql
```

```
rbenv exec bundle install --path vendor/bundle 
```

s
※2回目からは–path vendor/bundleをつけなくても自動でvendor/bundleへインストールしてくれます。

なぜかrubyのバージョンを示すファイルが書き換わっていた．


### 「config/database.yml」ファイルの中身を書き換えます。
```
ファイル名：config/database.yml
 
production:
  <<: *default
  database: db/production.sqlite3
```

```
ファイル名：config/database.yml
 
production:
  <<: *default
  adapter: postgresql
  encoding: unicode
  pool: 5
```


## heorkuにログイン


```
heroku create サーバーの名前
```
maximum is 30 characters
```
heroku create heroku-second-webapp-1021

```

```
git remote add heroku https://git.heroku.com/xxxxx-xxxxx-xxxxx.git
```
```

heroku open

```
## Gitにpush

herokuにデプロイする前にgitにpushする必要がある．
初期化
```
初期化
$git init 
今までの作成差分を全部add
$git add .
コミット
$git commit -m "コミットに関するメッセージ"

$git remote add origin ""
```

以下のコマンドでデプロイ
```
git push heroku master
```

gitのログを確認
```
git log --graph --abbrev-commit --decorate --format=format:'%C(bold blue)%h%C(reset) - %C(bold green)(%ar)%C(reset) %C(white)%s%C(reset) %C(dim white)- %an%C(reset)%C(bold yellow)%d%C(reset)' --all

```


```
git push ssh://git@github.com/yushanks/First_app_ralis.git master:master

```

## アプリを作成していく

herokuにデプロイする前にgitにpushする必要がある．
初期化

## DBのコラムを確認
rails console上で
```
User.column_names
=> ["id", "name", "email", "created_at", "updated_at", "image_name", "password"]
```
rails dbconsole上で
```
select * from users;
```
image_nameを持たないユーザが存在することがわかった

```
1|testname|jis_test.com|2018-10-29 03:12:28.961306|2018-10-30 08:55:47.988159|1.jpg|nirvana
2|test|jis_stera.comsss|2018-10-29 03:35:22.473012|2018-10-29 03:46:43.826662||
3|yushiro|test.com|2018-10-30 07:56:13.703162|2018-10-30 07:56:13.703162||
4|Yushiro Ishii|jis_ushan@yahoo.co.jp|2018-10-30 09:22:14.267143|2018-10-30 09:22:14.267143|default_user.jpg|test
5|yuu|wanko@prog-8.com|2018-10-30 09:38:16.516544|2018-11-10 07:27:30.039629|5.jpg|arue

```
