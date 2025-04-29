package main

import (
	"fmt"
	"net/http"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/mattn/go-sqlite3"
	"github.com/pkg/errors"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var (
	db        *gorm.DB
	cookieKey = "tk"
)

const sesionTokenExpiresDuration = 432000

type (
	User struct {
		ID       int64  `form:"id" json:"id"`
		Username string `json:"username"`
		Nickname string `json:"nickname"`
		Password string `json:"password"`
	}
	Blog struct {
		ID        int64  `form:"id" json:"id"`
		Title     string `json:"title"`
		Content   string `json:"content"`
		CreatedAt int64  `json:"created_at"`
	}
)

func init() {
	var err error
	db, err = gorm.Open(sqlite.Open("./database.db"), &gorm.Config{})
	if err != nil {
		panic(err)
	}

	err = db.Exec(`CREATE TABLE IF NOT EXISTS users(
		id integer PRIMARY KEY AUTOINCREMENT,
		username varchar(32) NOT NULL,
		nickname varchar(32) NOT NULL,
		password varchar(32) NOT NULL
	);
	CREATE TABLE IF NOT EXISTS blogs(
		id integer PRIMARY KEY AUTOINCREMENT,
		title varchar(128) NOT NULL,
		content text,
		created_at integer NOT NULL
	);
	`).Error
	if err != nil {
		panic(err)
	}
}

func main() {
	r := gin.New()
	r.Use(gin.LoggerWithFormatter(logFormat))
	r.Use(gin.Recovery())
	cfg := cors.DefaultConfig()
	cfg.AllowAllOrigins = true
	cfg.AllowCredentials = true

	cfg.AddAllowHeaders("*")
	r.Use(cors.New(cfg))
	api := r.Group("/api")
	api.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})

	api.POST("/login", func(ctx *gin.Context) {
		var req User
		if err := ctx.ShouldBind(&req); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": err.Error()})
			return
		}
		var user User
		if err := db.Table("users").Where("username = ?", req.Username).Find(&user).Error; err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": err.Error()})
			return
		}

		if req.Username == user.Username && req.Password == user.Password {
			ck, err := generateToken(req.Username)
			if err != nil {
				ctx.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": err.Error()})
				return
			}
			ctx.SetCookie(cookieKey, ck, sesionTokenExpiresDuration, "/", ctx.Request.Host, false, true)
			ctx.JSON(http.StatusOK, gin.H{"data": user})
		}
		ctx.JSON(http.StatusNotAcceptable, gin.H{"code": 409, "message": "账号或密码错误"})
	})

	api.POST("/users", func(ctx *gin.Context) {
		var req User
		if err := ctx.ShouldBind(&req); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": err.Error()})
			return
		}
		fmt.Println(req)
		if err := db.Table("users").Create(&req).Error; err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": err.Error()})
			return
		}
		ctx.JSON(http.StatusOK, gin.H{"code": 0, "message": "", "data": req})
	})
	api.DELETE("/users", func(ctx *gin.Context) {
		var req User
		if err := ctx.ShouldBind(&req); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": err.Error()})
			return
		}
		fmt.Println(req)
		if err := db.Table("users").Where("id = ?", req.ID).Delete(&req).Error; err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": err.Error()})
			return
		}
		ctx.JSON(http.StatusOK, gin.H{"code": 0, "message": ""})
	})
	api.PUT("/users", func(ctx *gin.Context) {
		var req User
		if err := ctx.ShouldBind(&req); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": err.Error()})
			return
		}
		if err := db.Table("users").Where("id = ?", req.ID).Updates(&req).Error; err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": err.Error()})
			return
		}
		ctx.JSON(http.StatusOK, gin.H{"code": 0, "message": ""})
	})
	api.GET("/users", func(ctx *gin.Context) {
		var users []User
		if err := db.Table("users").Find(&users).Error; err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": err.Error()})
			return
		}
		ctx.JSON(http.StatusOK, gin.H{"code": 0, "message": "", "data": users})
	})

	api.POST("/blogs", func(ctx *gin.Context) {
		var req Blog
		if err := ctx.ShouldBind(&req); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": err.Error()})
			return
		}
		req.CreatedAt = time.Now().Unix()
		if err := db.Table("blogs").Create(&req).Error; err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": err.Error()})
			return
		}
		ctx.JSON(http.StatusOK, gin.H{"code": 0, "message": "", "data": req})
	})
	api.DELETE("/blogs", func(ctx *gin.Context) {
		var req Blog
		if err := ctx.ShouldBind(&req); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": err.Error()})
			return
		}
		if err := db.Table("blogs").Where("id = ?", req.ID).Delete(&req).Error; err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": err.Error()})
			return
		}
		ctx.JSON(http.StatusOK, gin.H{"code": 0, "message": ""})
	})
	api.PUT("/blogs", func(ctx *gin.Context) {
		var req Blog
		if err := ctx.ShouldBind(&req); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": err.Error()})
			return
		}
		if err := db.Table("blogs").Where("id = ?", req.ID).Updates(&req).Error; err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": err.Error()})
			return
		}
		ctx.JSON(http.StatusOK, gin.H{"code": 0, "message": ""})
	})
	api.GET("/blogs", func(ctx *gin.Context) {
		var blogs []Blog
		if err := db.Table("blogs").Find(&blogs).Error; err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": err.Error()})
			return
		}
		ctx.JSON(http.StatusOK, gin.H{"code": 0, "message": "", "data": blogs})
	})

	r.Run(":9000") // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
}

func logFormat(param gin.LogFormatterParams) string {
	return fmt.Sprintf("%s - [%s] %s %s %d\n",
		param.ClientIP,
		param.TimeStamp.Format(time.RFC3339),
		param.Method,
		param.Path,
		// param.Request.FormValue("idCard"),
		param.StatusCode,
	)
}

// SessionToken 会话
type SessionToken struct {
	Username string
	jwt.StandardClaims
}

func generateToken(username string) (string, error) {
	t := SessionToken{
		username,
		jwt.StandardClaims{
			ExpiresAt: time.Now().Add(sesionTokenExpiresDuration * time.Second).Unix(),
		},
	}
	claims := jwt.NewWithClaims(jwt.SigningMethodHS256, t)
	token, err := claims.SignedString([]byte("46608612-1df3-4d67-8fe1-1d0249eb7bb9"))
	if err != nil {
		return "", errors.WithStack(err)
	}
	return token, nil
}

func parseToken(tokenStr string) (*SessionToken, error) {
	tokenClaims, err := jwt.ParseWithClaims(tokenStr, &SessionToken{}, func(token *jwt.Token) (interface{}, error) {
		_, ok := token.Claims.(*SessionToken)
		if !ok {
			return nil, errors.New("unkonown token")
		}

		return []byte("46608612-1df3-4d67-8fe1-1d0249eb7bb9"), nil
	})

	if tokenClaims != nil {
		if token, ok := tokenClaims.Claims.(*SessionToken); ok && tokenClaims.Valid {
			return token, nil
		}
	}

	return nil, errors.WithStack(err)
}
