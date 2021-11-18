
1. db 만들기
- cmd
    1. cmd mysql 경로 이동후 mysql -u root -p이후 1234
    2. create database projectA default character set utf8 collate utf8_general_ci;
    3. GRANT ALL PRIVILEGES ON projectA.* TO projectA@localhost identified by '1234'; 
    exit 


    - 테이블 스키마
        tb_member
        tb_board
        tb_fileboard
        

        - tb_member				
            member_id		varcahr(40), primary key
            user_id			varchar(40), unique
            password			varchar(200),
            username			varchar(40),
            phone			varchar(40),
            email			varchar(40),
            nickname			varchar(40),
            zipcode			char(6),
            adress			varchar(200),
            adress2			varchar(200),
            wdate			datetime
            state			char(1)


        - tb_board
            board_id			int primarykey autoincrement,
            write_id			int foreign key(tb_member의 member_id),
            title			varchar(600),
            contents			longtext,
            hit			int,
            ip			varchar(40),
            delyn			char(1),
            regdate			datetime -- 등록일자
            moddate			datetime -- 수정일자

        - tb_fileboard
            file_id			int primary key autoincrement
            board_id			int forein key(tb_board의 board_id)
            filename			varchar(256)
            wdate			datetime


2. node ejfs mysql 만들기
 
    cmd

    경로로 이동

    express 폴더이름 --view=ejs

    cd 폴더이름

    install npm

    install npm mysql


3. 퍼블리서가 디자인을 준다
    - 확장자가 ejs인 파일로 만들어 수정한다

    - views             routes
        ㄴ member           ㄴ member.js
        ㄴ board            ㄴ board.js


4. 세션 모듈 설치
    - 1. npm install express-session
         npm install session-file-store
        - 브라우저가 서버로 접속이되면 세션이라는 정보가 하나씩 만들어진다
    
    - 2. app.js
        - const session = require('express-session');
        - const fileStore = require('session-file-store')(session);
        <!--미들웨어 값등록 -->
        - app.use( session({secret:'dkedk', resave:false, saveUninitialized:true, store:new fileStore()}));