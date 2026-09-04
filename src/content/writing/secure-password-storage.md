---
title: "用户密码的安全存储"
description: "明文就是直接存储密码，这样有很大的风险，比如数据泄露，被人攻击等问题。"
publishedAt: 2024-06-24
type: technical
tags: []
draft: false
readingMinutes: 3
---
##### 为什么不能明文存储密码？
明文就是直接存储密码，这样有很大的风险，比如数据泄露，被人攻击等问题。所以为了避免这些问题，我们需要对密码进行加密存储。
##### 非明文存储密码
###### 哈希算法
密码哈希是一种将密码转换为固定长度字符串的技术，这个字符串与原始密码完全不同且不可逆。
###### 盐值
盐值(salt)是指在进行密码哈希之前，向密码添加的一段随机数据。通常被添加到密码的开头或结尾，或者插入到密码的某个位置。其主要目的是确保即使两个用户拥有相同的密码，最终存储在数据库中的哈希值也会不同。

###### 代码实现
在Go中，我们可以使用`golang.org/x/crypto/bcrypt`库来处理密码的哈希和验证并且它内置了盐值的生成和管理。
```go
package main
import ( "fmt"
		"log"
		"golang.org/x/crypto/bcrypt"
)
// HashPassword 将密码进行哈希处理
func HashPassword(password string) (string, error){
     // 使用bcrypt生成密码的哈希值
    hashedPassword,err:=bcrypt.GenerateFromPassword([]byte(password),
        bcrypt.DefaultCost)
     if err != nil {
         return "", err
     }
     return string(hashedPassword), nil
 }
// CheckPasswordHash 验证输入的密码是否正确
func CheckPasswordHash(password, hashedPassword string) bool {
   // 使用bcrypt比较密码和哈希值
     err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
     return err == nil
}
func main() {
   // 假设这是用户输入的密码
    password := "cxcxcxpassword"
   // 哈希密码
   hashedPassword, err := HashPassword(password)
   if err != nil {
         log.Fatalf("错误: %v", err)
    }
    fmt.Printf("原始密码: %s\n", password)
    fmt.Printf("哈希后的密码: %s\n", hashedPassword)
    // 验证密码
    isValid := CheckPasswordHash(password, hashedPassword)
    fmt.Printf("密码验证结果: %v\n", isValid)
}
```
过程：
1. 引入包：我们使用`golang.org/x/crypto/bcrypt`包来处理密码的哈希和验证。
2. HashPassword函数：该函数使用bcrypt库生成密码的哈希值。bcrypt在内部自动生成一个盐值，并将其添加到密码中进行哈希处理。生成的哈希值包含了盐值，因此在验证密码时不需要单独存储盐值。
3. CheckPasswordHash函数：该函数使用bcrypt库比较输入的密码和存储的哈希值。bcrypt库会从哈希值中提取盐值，并使用它来验证密码。

##### 结尾
这就是用户密码的非明文存储，密码哈希算法可以有效地保护用户密码的安全，有效防止密码泄露，保护用户数据安全。
