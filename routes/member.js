var express = require("express");
var router = express.Router();
var mysql = require("mysql");

var pool = mysql.createPool(  { host:'127.0.0.1', user:'projectA', password:'1234', 
database:'projectA', port:5306} );

//http://127.0.0.1:4000/member/register_form 
router.get("/register_form", (req, res)=>{
    var userinfo = {
        user_id:req.session["user_id"], 
        username:req.session["username"],
        email:req.session["email"] 
    };

    res.render("member/member_register", {userinfo:userinfo} ); //views/member/member_register.ejs 를 불러와서 화면에 보이기 
});

//http://127.0.0.1:4000/member/register
router.post("/register", (req, res)=>{
    
    var user_id = req.body.user_id;
    var username = req.body.username;
    var password = req.body.password;
    var email = req.body.email;
    var phone = req.body.phone;
    var nickname = req.body.nickname;
    var zipcode = req.body.zipcode;
    var address1 = req.body.address1;
    var address2 = req.body.address2;

    pool.getConnection( (err, connection)=>{
        var sql = `
        insert into tb_member(user_id, username, password, email, phone, nickname, 
            zipcode, address1, address2, wdate)
        values ( '${user_id}', '${username}', '${password}', '${email}', '${phone}', '${nickname}', 
        '${zipcode}', '${address1}', '${address2}', now()) `;
        console.log(sql);

        connection.query(sql, (err, results)=>{
            //res.redirect("/");
            res.send({"result":"success"})
        });
    });
}); 

//http://127.0.0.1:4000/member/idcheck
router.post("/idcheck", (req, res)=>{
    var user_id = req.body.user_id;
    
    pool.getConnection( (err, connection)=>{
        var sql = `select count(*) cnt from tb_member where user_id='${user_id}' `;
        console.log(sql);
        connection.query(sql, (err, results)=>{
            var result = parseInt(results[0]["cnt"]);
            if (result==0)
                res.send({"result":"success"});
            else
                res.send({"result":"fail"});
        });
    });
}); 


//restpul api 서버라면 ejs  호출은 필요없다. 
//http://127.0.0.1:4000/member/logon_form -- get 
router.get("/logon_form", (req, res)=>{
    res.render("member/member_logon"); //views/member/member_register.ejs 를 불러와서 화면에 보이기 
});

//http://127.0.0.1:4000/member/logon  -- POST, ajax로 요청하기 - jquery ajax -> axios  ajax 
router.post("/logon", (req, res)=>{
    var user_id = req.body.user_id;
    var password = req.body.password;
    
    pool.getConnection( (err, connection)=>{
        var sql = `select * from tb_member where user_id='${user_id}' `;
        console.log(sql);
        connection.query(sql, (err, results)=>{
            
            if (results.length ==0) 
                res.send({"result":"3"}); //아이디도 없는 경우 
            else
            {
                if(password == results[0]["password"])
                {
                    req.session["user_id"]=results[0]["user_id"];
                    req.session["username"]=results[0]["username"];
                    req.session["email"]=results[0]["email"];

                    res.send({"result":"1"});
                }
                else
                    res.send({"result":"2"});//아이디는 맞는데 패스워드가 틀린경우 
            }
        });
    });
}); 

router.use("/logout", (req, res)=>{
    req.session.destroy(); //세션 없애기 
    //메인 또는 로그온 페이지로 이동한다 
    res.redirect("/"); 
})





module.exports = router;  //반드시 모듈을 내보내야 다른 파일에서 이 파일내의 router 에 접근이 가능하다 




