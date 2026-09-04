---
title: "Java高级：反射（Reflect）笔记"
description: "整理 Java 反射中的 Class、构造器、字段、方法与访问控制。"
publishedAt: 2022-07-08
updatedAt: 2026-09-04
type: technical
tags: ["Java高级", "Java", "笔记"]
draft: false
readingMinutes: 21
---
## Java 高级：反射(reflect)笔记

### 1. 反射的概述

是在运行状态中，对于任意一个类，都能够知道这个类的所有属性和方法；
对于任意一个对象，都能够调用它的任意属性和方法；
这种动态获取信息以及动态调用对象方法的功能称为 Java 语言的反射机制。

**一句话总结：反射就是在运行时才知道要操作的类是什么，并且可以在运行时获取类的完整构造，并调用对应的方法。**

### 2. 为什么要使用反射

- 获取任意类的名称、package 信息、所有属性、方法、注解、类型、类加载器等
- 获取任意对象的属性，并且能改变对象的属性
- 调用任意对象的方法
- 判断任意一个对象所属的类
- 实例化任意一个类的对象
- 通过反射我们可以实现动态装配，降低代码的耦合度,动态代理等。

### 3. 获取 Class 对象的三种方式

- 类名.class 属性
- 对象名.getClass()方法
- Class.forName(全类名)方法

```java
public class ReflectDemo {
    public static void main(String[] args) throws ClassNotFoundException {
        /*获取Class类的对象*/
        //第一种方法，forName(全类名)
        Class aClass = Class.forName("com.chen.reflectdemo1.Student");
        System.out.println(aClass);

        //第二种,通过Class属性来获取
        Class aClass2 = Student.class;
        System.out.println(aClass2);

        //第三种，利用对象的getclass
        Student student = new Student();
        Class<? extends Student> aClass3 = student.getClass();
        System.out.println(aClass3);
    }
}
public class Student {
    private String name;
    private int age;
    public Student() {
    }
    public Student(String name, int age) {
        this.name = name;
        this.age = age;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public int getAge() {
        return age;
    }
    public void setAge(int age) {
        this.age = age;
    }
    public void Studt(){
        System.out.println("学生上课");
    }
    @Override
    public String toString() {
        return "Student{" +
                "name='" + name + '\'' +
                ", age=" + age +
                '}';
    }
}
```

### 4. 反射获取构造方法

#### 4.1 Class 类获取构造方法对象的方法

- getConstructors() 返回所有公共构造方法的数组
- getConstructor(参数和构造方法参数一致)返回单个公共构造方法
- getDeclaredConstructors() 返回所有构造方法的数组
- getDeclaredConstructor(参数和构造方法参数一致)返回单个私有构造方法的数组

```java
private static void method4() throws ClassNotFoundException, NoSuchMethodException {
    Class aClass = Class.forName("com.chen.reflectdemo2.Student");
    Constructor constructor = aClass.getDeclaredConstructor(String.class);
    System.out.println(constructor);
}

private static void method3() throws ClassNotFoundException {
    Class aClass = Class.forName("com.chen.reflectdemo2.Student");
    Constructor[] constructors = aClass.getDeclaredConstructors();
    for (Constructor constructor : constructors) {
        System.out.println(constructor);
    }
}

private static void method2() throws ClassNotFoundException, NoSuchMethodException {
    Class aClass = Class.forName("com.chen.reflectdemo2.Student");
    Constructor constructor = aClass.getConstructor(String.class, int.class);
    System.out.println(constructor);
}

private static void method1() throws ClassNotFoundException {
    Class aClass = Class.forName("com.chen.reflectdemo2.Student");
    Constructor[] constructors1 = aClass.getConstructors();
    for (Constructor constructor : constructors1) {
        System.out.println(constructor);
    }
}
```

#### 4.2 Constructor 类用于创建对象的方法

| 方法名                           | 说明                         |
| -------------------------------- | ---------------------------- |
| T newInstance(Object...initargs) | 根据指定的构造方法创建对象   |
| setAccessible(boolean flag)      | 设置为 true,表示取消访问检查 |

```java
public class ReflectDemo2 {
    public static void main(String[] args) throws ClassNotFoundException, NoSuchMethodException, IllegalAccessException, InvocationTargetException, InstantiationException {
        /*Constructor用于创建对象的方法*/
        //T newInstance（参数）
        //method1();
        //metho2();
        //metho3();
    }

    private static void metho3() throws ClassNotFoundException, NoSuchMethodException, InstantiationException, IllegalAccessException, InvocationTargetException {
        //1.获取Class类的对象
        Class aClass = Class.forName("com.chen.reflectdemo2.Student");
        //2获取Constructor构造方法对象 （演示返回单个公共构造方法）空参
        Constructor constructor = aClass.getConstructor();
        //3.newInstance来创建对象
        Student zhangsan = (Student) constructor.newInstance();
        System.out.println(zhangsan);
    }

    private static void metho2() throws ClassNotFoundException, NoSuchMethodException, InstantiationException, IllegalAccessException, InvocationTargetException {
        //1.获取Class类的对象
        Class aClass = Class.forName("com.chen.reflectdemo2.Student");
        //2获取Constructor构造方法对象 （演示返回单个私有构造方法）
        Constructor constructor = aClass.getDeclaredConstructor(String.class);
        //私有的注意点
        //3.被private修饰的不能直接使用，需要临时取消访问检查
        constructor.setAccessible(true);
        //4.newInstance来创建对象
        Student zhangsan = (Student) constructor.newInstance("zhangsan");
        System.out.println(zhangsan);
    }

    private static void method1() throws ClassNotFoundException, NoSuchMethodException, InstantiationException, IllegalAccessException, InvocationTargetException {
        //1.获取Class类的对象
        Class aClass = Class.forName("com.chen.reflectdemo2.Student");
        //2获取Constructor构造方法对象 （演示返回单个公共构造方法）
        Constructor constructor = aClass.getConstructor(String.class, int.class);
        //3.newInstance来创建对象
        Student zhangsan = (Student) constructor.newInstance("zhangsan", 15);
        System.out.println(zhangsan);
    }
}
public class Student {
    private String name;
    private int age;
    /*--------------------------------------*/
    //私有的有参构造方法
    private Student(String name) {
        System.out.println("name的值为" + name);
        System.out.println("私有的有参构造方法");
    }
    //公有的无参构造方法
    public Student() {
        System.out.println("公有无参构造方法");
    }
    //共有的有参构造
    public Student(String name, int age) {
        System.out.println("name的值为" + name + "int的值为" + age);
        System.out.println("公有的有参构造方法");
    }
}
```

### 5.反射获取成员变量

#### 5.1 Class 类获取成员变量对象的方法

方法分类

| 方法名                              | 说明                           |
| ----------------------------------- | ------------------------------ |
| Field[] getFields()                 | 返回所有公共成员变量对象的数组 |
| Field[] getDeclaredFields()         | 返回所有成员变量对象的数组     |
| Field getField(String name)         | 返回单个公共成员变量对象       |
| Field getDeclaredField(String name) | 返回单个成员变量对象           |

```java
public class ReflectDemo1 {
    public static void main(String[] args) throws ClassNotFoundException, NoSuchFieldException {
        /*获取Field对象*/
        //getFields()返回所有公共成员变量的对象数组
        //method1();
        //getDeclaredFields()返回所有成员变量的对象数组
        //method2();
        //getField("name")返回单个公共成员变量的对象
        //method3();
        //getDeclaredField("")返回单个成员变量的对象
        //method4();
    }

    private static void method4() throws ClassNotFoundException, NoSuchFieldException {
        //1.获取class类的对象
        Class aClass = Class.forName("com.chen.reflectdemo3.Student");
        //2.获取Field对象
        Field money = aClass.getDeclaredField("money");
        System.out.println(money);
    }

    private static void method3() throws ClassNotFoundException, NoSuchFieldException {
        //1.获取class类的对象
        Class aClass = Class.forName("com.chen.reflectdemo3.Student");
        //2.获取Field对象
        //想要获得的单个成员变量必须是真实存在的
        Field name = aClass.getField("name");
        System.out.println(name);
    }

    private static void method2() throws ClassNotFoundException {
        //1.获取class类的对象
        Class aClass = Class.forName("com.chen.reflectdemo3.Student");
        //2.获取Field对象
        Field[] declaredFields = aClass.getDeclaredFields();
        //3.遍历
        for (Field declaredField : declaredFields) {
            System.out.println(declaredField);
        }
    }

    private static void method1() throws ClassNotFoundException {
        //1.获取class类的对象
        Class aClass = Class.forName("com.chen.reflectdemo3.Student");
        //2.获取Field对象
        Field[] fields = aClass.getFields();
        //3.遍历
        for (Field field : fields) {
            System.out.println(field);
        }
    }
}
public class Student {
    public String name;
    public int age;
    public String gender;

    private int money = 100;

    @Override
    public String toString() {
        return "Student{" +
                "name='" + name + '\'' +
                ", age=" + age +
                ", gender='" + gender + '\'' +
                ", money=" + money +
                '}';
    }
}

```

#### 5.2 Field 类用于给成员变量赋值的方法

- 赋值 void set(Object obj, Object value)指定对象的成员变量赋值
- 获取值 void get(Object obj) 返回指定对象的 Field 值

```java
public class ReflectDemo2 {
    public static void main(String[] args) throws IllegalAccessException, InstantiationException, NoSuchFieldException, ClassNotFoundException {
        /*赋值或者获取值*/
        //赋值void set(Student,"lisi")指定对象的成员变量赋值
        //method1();
        //赋值void get() 返回指定对象的Field值
        //method2();
    }

    private static void method2() throws ClassNotFoundException, NoSuchFieldException, InstantiationException, IllegalAccessException {
        //1.获取class类的对象
        Class aClass = Class.forName("com.chen.reflectdemo3.Student");
        //2.获取Field对象
        Field money = aClass.getDeclaredField("money");
        //3.因为是私有变量需要取消访问检查
        money.setAccessible(true);
        //4.创建对象
        Student Student = (com.chen.reflectdemo3.Student) aClass.newInstance();
        //5.获取值
        Object s = money.get(Student);
        System.out.println(s);
    }

    private static void method1() throws ClassNotFoundException, NoSuchFieldException, InstantiationException, IllegalAccessException {
        //1.获取class类的对象
        Class aClass = Class.forName("com.chen.reflectdemo3.Student");
        //2.获取Field对象
        //想要获得的单个成员变量必须是真实存在的
        Field name = aClass.getField("name");
        //3.创建对象来进行赋值
        Student Student = (com.chen.reflectdemo3.Student) aClass.newInstance();
        //4.赋值
        name.set(Student,"lisi");
        System.out.println(Student);
    }
}
```

### 6.反射获取成员方法

#### 6.1 Class 类获取成员方法对象的方法

| 方法名                                                            | 说明                                       |
| ----------------------------------------------------------------- | ------------------------------------------ |
| Method[] getMethods()                                             | 返回所有公共成员方法对象的数组，包括继承的 |
| Method[] getDeclaredMethods()                                     | 返回所有成员方法对象的数组，不包括继承的   |
| Method getMethod(String name, Class<?>... parameterTypes)         | 返回单个公共成员方法对象                   |
| Method getDeclaredMethod(String name, Class<?>... parameterTypes) | 返回单个成员方法对象                       |

```java
public class ReflectDemo1 {
    public static void main(String[] args) throws ClassNotFoundException, NoSuchMethodException {
        /*获得Method对象*/
        //getMethods()返回所有公共成员方法对象，包括继承的（父类）
        //method1();
        //getDeclaredMethods()返回所有成员方法对象，不包括继承的（父类）
        //method2();
        //getMethod(方法名，带参方法里面的参数)返回单个公共成员方法对象
        //method3();
        //getDeclaredMethod("show")返回单个成员方法对象
        //method4();
    }

    private static void method4() throws ClassNotFoundException, NoSuchMethodException {
        //1.获取class类的对象
        Class aClass = Class.forName("com.chen.reflectdemo4.Student");
        //2.获得Method对象
        Method show = aClass.getDeclaredMethod("show");
        System.out.println(show);
    }

    private static void method3() throws ClassNotFoundException, NoSuchMethodException {
        //1.获取class类的对象
        Class aClass = Class.forName("com.chen.reflectdemo4.Student");
        //2.获得Method对象
        Method function1 = aClass.getMethod("function1");
        System.out.println(function1);
    }

    private static void method2() throws ClassNotFoundException {
        //1.获取class类的对象
        Class aClass = Class.forName("com.chen.reflectdemo4.Student");
        //2.获得Method对象
        Method[] methods = aClass.getDeclaredMethods();
        for (Method method : methods) {
            System.out.println(method);
        }
    }

    private static void method1() throws ClassNotFoundException {
        //1.获取class类的对象
        Class aClass = Class.forName("com.chen.reflectdemo4.Student");
        //2.获得Method对象
        Method[] methods = aClass.getMethods();
        for (Method method : methods) {
            System.out.println(method);
        }
    }
}
```

#### 6.2 Method 类用于执行方法的方法

方法介绍

| 方法名                                    | 说明     |
| ----------------------------------------- | -------- |
| Object invoke(Object obj, Object... args) | 运行方法 |

参数一: 用 obj 对象调用该方法

参数二: 调用方法的传递的参数(如果没有就不写)

返回值: 方法的返回值(如果没有就不写)

```java
public class ReflectDemo2 {
    public static void main(String[] args) throws ClassNotFoundException, IllegalAccessException, InstantiationException, InvocationTargetException, NoSuchMethodException {
        /*运行方法*/
        //invoke(参数1，参数2)
        //参数一：用对象调用该方法
        //参数二：调用方法传递的参数
        //返回值；方法的返回值
        //1.获取class类的对象
        Class aClass = Class.forName("com.chen.reflectdemo4.Student");
        //2.获得Method对象
        Method method = aClass.getMethod("function4", String.class);
        //3.创建对象
        Student Student = (com.chen.reflectdemo4.Student) aClass.newInstance();
        //4.运行方法
        Object o = method.invoke(Student, "zhangsan");
        System.out.println(o);
    }
}
```

### 7. 反射技术整体运用练习

主要代码展示：

```java
public class ReflectDemo1 {
    public static void main(String[] args) throws IOException, ClassNotFoundException, NoSuchMethodException, IllegalAccessException, InvocationTargetException, InstantiationException {
        //1.获取一个类加载器
        ClassLoader classLoader = ClassLoader.getSystemClassLoader();
        //2.利用加载器加载某一个资源文件
        //参数就是文件路径
        //返回值是字节流
        InputStream is = classLoader.getResourceAsStream("prop.properties");
        //创建properties对象
        Properties prop = new Properties();
        prop.load(is);
        //System.out.println(prop);
        //释放资源
        is.close();

        //利用反射创建对象并且调用方法
        Class aClass = Class.forName(prop.getProperty("className"));
        //获取构造器对象
        Constructor constructor = aClass.getConstructor();
        //利用构造器创建对象
        Object o = constructor.newInstance();
        //获取对象方法
        Method method = aClass.getMethod(prop.getProperty("methodName"));
        //运行方法
        method.invoke(o);

    }
}
```

```java
public class Teacher {
    private String name;
    private String gender;
    private int age;

    public Teacher() {
    }

    public Teacher(String name, String gender, int age) {
        this.name = name;
        this.gender = gender;
        this.age = age;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public void teach(){
        System.out.println("老师在上课");
    }

    @Override
    public String toString() {
        return "Teacher{" +
                "name='" + name + '\'' +
                ", gender='" + gender + '\'' +
                ", age=" + age +
                '}';
    }
    public class Student {
    private String name;
    private int age;
    private String birthday;

    public Student() {
    }

    public Student(String name, int age, String birthday) {
        this.name = name;
        this.age = age;
        this.birthday = birthday;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getBirthday() {
        return birthday;
    }

    public void setBirthday(String birthday) {
        this.birthday = birthday;
    }

    public void study(){
        System.out.println("学生在学习");
    }

    @Override
    public String toString() {
        return "Student{" +
                "name='" + name + '\'' +
                ", age=" + age +
                ", birthday='" + birthday + '\'' +
                '}';
    }
}
```

```properties
className=com.chen.reflectdemo5.Teacher
methodName=teach
```
