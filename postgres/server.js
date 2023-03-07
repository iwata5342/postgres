const express = require("express");
const pool = require("./db");
const app = express();
const PORT = 5000;

app.use(express.json()); // json形式の使用を宣言
app.get("/", (req, res) => {
    res.send("Hello Express");
});

// ユーザ情報全て取得する
app.get("/users", (req, res) => {
    pool.query("SELECT * FROM USERS", (error, results) => { // データベース問い合わせ
        if (error) throw error;
        return res.status(200).json(results.rows);
    });
});

// 特定のユーザを取得する
app.get("/users/:id", (req, res) => {
    const id = req.params.id;
    pool.query("SELECT * FROM USERS WHERE id = $1", [id], (error, results) => { // データベース問い合わせ
        if (error) throw error;
        return res.status(200).json(results.rows);
    });
});

// ユーザを追加する
app.post("/users", (req, res) => {
    const { name, email, age } = req.body;
    // ユーザが存在するか確認
    pool.query(
      "SELECT s FROM USERS s WHERE s.email = $1", 
      [email], 
      (error, results) => {
        if (results.rows.length) {
            return res.send("既にユーザが存在しています");
        };

        pool.query("INSERT INTO USERS(name, email, age) values($1, $2, $3)", [name, email, age], (error, results) => {
            if (error) throw error;
            res.status(201).send("ユーザの作成に成功しました");
        });
    });
});

// ユーザを削除する
app.delete("/users/:id", (req, res) => {
    const id = req.params.id;
    pool.query("SELECT * FROM USERS WHERE id = $1", [id], (error, results) => { // データベース問い合わせ
        if (error) throw error;
        const isUserExisted = results.rows.length;
        if (!isUserExisted) {
            return res.send("ユーザが存在しません");
        }
        pool.query("DELETE FROM USERS WHERE id = $1", [id], (error, results) => { // データベース問い合わせ
            if (error) throw error;
            return res.status(200).send("ID : " + id + " のユーザを削除しました");
        });
    });
});

// ユーザを更新する
app.put("/users/:id", (req, res) => {
    const id = req.params.id;
    const name = req.body.name;

    pool.query("SELECT * FROM USERS WHERE id = $1", [id], (error, results) => { // データベース問い合わせ
        if (error) throw error;
        const isUserExisted = results.rows.length;
        if (!isUserExisted) {
            return res.send("ユーザが存在しません");
        }

        pool.query(
          "UPDATE USERS SET name = $1 WHERE id = $2", 
          [name, id], (error, results) => {
            if (error) throw error;
            return res.status(200).send("ID : " + id + " のユーザを更新しました");
        });
    });
});


app.listen(PORT, () => {
    console.log("server is running on PORT : " + PORT);
});