var express = require('express');
var router = express.Router();
var mysql = require('mysql');
/* GET home page. */

var pool = mysql.createPool(  { host:'127.0.0.1', user:'projectA', password:'1234', 
database:'projectA', port:5306} );

router.get("/", (res, req)=>{
    res.redirect("/board/list/1");
});

//본인들이 데이터가져와서 작업하기 
router.get('/list/:page', function(req, res, next) {
  var userinfo = {
    user_id:req.session["user_id"], 
    username:req.session["username"],
    email:req.session["email"] 
  };

  var page = parseInt(req.params.page);
  var pageSize = 10;

  pool.getConnection( (err, connection)=>{
    var sql=`SELECT board_id, username writer, title, contents, hit,  DATE_FORMAT(regdate, "%Y-%m-%d" ) wdate 
            FROM tb_board A
            LEFT OUTER JOIN tb_member B ON A.write_id=B.member_id
            where 1=1 
            order by board_id desc 
            limit ${(page-1)*pageSize}, ${pageSize} `;
    console.log(sql);

    connection.query(sql, (err, results)=>{
        console.log( results );

        //db로 부터 데이터가 로딩된후 
        res.render('board/board_list', { userinfo:userinfo, boardList:results });
        connection.release();
    });    
  });  
});

router.use("/write", (req, res)=>{
    var userinfo = {
        user_id:req.session["user_id"], 
        username:req.session["username"],
        email:req.session["email"] 
    };
    res.render("board/board_write.ejs", {userinfo:userinfo});
});


router.post("/save", (req, res)=>{
    var write_id = req.body.write_id;
    var title = req.body.title;
    var contents = req.body.contents;

    if(write_id=="") write_id=1;

    pool.getConnection( (err, connection)=>{
        var sql=`INSERT INTO tb_board(write_id, title, contents, hit, regdate, delyn) VALUES 
                ( ${write_id}, '${title}', '${contents}', 0, NOW(), 'N')`;

        //console.log(sql);
        connection.query(sql, (err, results)=>{
            console.log( results );
            res.redirect("/board/list");
            connection.release();
        });    
    });  
});

// view 조회수 업데이트
// view 내용가져와서 뿌리기
// 1. userinfo 정보 가지고 다녀야 함
// 2. 해당 아이디 가지고 와서 조회수 증가
// 3. 데이터 가져와서 보내주기

router.get("/view/:id", (req, res)=>{
  var id = req.params.id;

  var userinfo = {
    user_id:req.session["user_id"], 
    username:req.session["username"],
    email:req.session["email"] 
};

  var sql1 = `update tb_board set hit=hit+1 where board_id=${id}`;
  console.log(sql1);

  var sql2 =`SELECT board_id, username writer, title, contents, hit,  DATE_FORMAT(regdate, "%Y-%m-%d" ) wdate 
  FROM tb_board A
  LEFT OUTER JOIN tb_member B ON A.write_id=B.member_id
  where board_id=${id}`; 
  console.log(sql2);
  
  pool.getConnection( (err,connection)=>{
    connection.query( sql1,(err, results)=>{
      connection.query(sql2, (err, results)=>{
        res.render("board/board_view", {userinfo:userinfo, board:results[0]});
        connection.release();
      });
    });
  });
});







module.exports = router;


