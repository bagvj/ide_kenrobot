#ifndef _ROSYS_H_
#define _ROSYS_H_

#define __NUM_USE
#define __USART_USE
#define F_CPU 14745600UL

#include "avr/io.h"
#include "avr/interrupt.h"
#include "util/delay.h"

enum P{A =0,B,C,D,E,F,G};

//typedef unsigned char ol;
//const bool true=1;
//connst bool false=0;
void setup();
void loop();
void initTimer3();
void InitNumLed(unsigned char Port);void ToLed(unsigned int l);
void HC595_Send_Data(unsigned char byte);
void HC595_Output_Data(unsigned char data,unsigned char Location);
void delay_ms(unsigned long a);
void DCMotor(int index,int speed);
void InitMotor();
void InitServo();
void initKdm(unsigned char kdm);
int  KeyScan();
void Servo(unsigned char Index,int Degree);
void initStep(unsigned char step);
void goStep(unsigned char Index,unsigned int total,unsigned int speed, unsigned char mode, unsigned char );
void i2c_Motor(unsigned char Index,unsigned int mode,unsigned int speed, unsigned char dir);
void IoOutB(unsigned char address,int bit,unsigned char val);
unsigned char IoInB(unsigned char address,int bit);
void IoOut(unsigned char port,unsigned char value);
unsigned char IoIn(unsigned char port);
unsigned int read_adc(unsigned char adc_input);
unsigned int i2c_Ultr_Rag(unsigned char addr);
unsigned char uGetChar(unsigned char id);
void uPutChar(unsigned char id,unsigned char data);
void InitInt(unsigned char index,unsigned char enabled,unsigned char mode);
void InitLDM(unsigned char Line,unsigned char Red,unsigned char Green);
void LDM(unsigned char Line,unsigned char Red,unsigned char Green);
unsigned char RemoteReceive(unsigned char address);
unsigned int i2c_Ultr_Rag(unsigned char addr);
//------------------------------------------------------------------------
//发送给指定从机一个数据
//addr为从机地址，data数据
void i2c_maste_transt(unsigned char addr, unsigned char data);
//从从机地址读取一个数，输入地址，输出读到的数
unsigned char i2c_maste_read(unsigned char addr);
//初始化为主机
void twi_master_init(unsigned char band,unsigned char twps);

#define SYSTEM_CLOCK 14745600L
#define RC_CIRCLE  (20L*SYSTEM_CLOCK/1000L/8/2)
#define RC_DEGREE  (SYSTEM_CLOCK/100000L/8/2)
#define RC_ZERO    (15L*SYSTEM_CLOCK/10000L/8/2)

#define BIT(i) 1<<I
#define sbi(a,b) a|=BIT(b)

#define RIGHT_FORWORD 0X77
#define RIGHT_BACK 0X7D  //0x3D
#define LEFT_FORWORD 0XEE
#define LEFT_BACK 0XEB

#define UART_RX_BUFFER_SIZE 128
#define UART_RX_BUFFER_MASK (UART_RX_BUFFER_SIZE-1)
#if (UART_RX_BUFFER_SIZE & UART_RX_BUFFER_MASK)
#error RX buffer size is not a power of 2
#endif

#define UART_TX_BUFFER_SIZE 128
#define UART_TX_BUFFER_MASK (UART_TX_BUFFER_SIZE-1)
#if (UART_TX_BUFFER_SIZE & UART_TX_BUFFER_MASK)
#error TX buffer size is not a power of 2
#endif

#define i2c_Compass i2c_Ultr_Rag
#define TWIBAND                 0x64    //波特率
//主机发送状态码
#define TW_START				0x08	//START已发送
#define TW_REP_START			0x10	//重复START已发送
#define TW_MT_SLA_ACK			0x18	//SLA+W 已发送收到ACK
#define TW_MT_SLA_NACK			0x20	//SLA+W 已发送接收到NOT ACK
#define TW_MT_DATA_ACK			0x28	//数据已发送接收到ACK
#define TW_MT_DATA_NACK			0x30	//数据已发送接收到NOT ACK
#define TW_MT_ARB_LOST			0x38	//SLA+W 或数据的仲裁失败
 
//主机接收状态码
//#define TW_START				0x08	//START已发送
//#define TW_REP_START			0x10	//重复START已发送
#define TW_MR_ARB_LOST			0x38	//SLA+R 或NOT ACK 的仲裁失败
#define TW_MR_SLA_ACK			0x40	//SLA+R 已发送接收到ACK
#define TW_MR_SLA_NACK			0x48	//SLA+R 已发送接收到NOT ACK
#define TW_MR_DATA_ACK			0x50	//接收到数据ACK 已返回
#define TW_MR_DATA_NACK			0x58	//接收到数据NOT ACK已返回
 
//从机接收状态码
#define TW_SR_SLA_ACK			0x60	//自己的SLA+W 已经被接收ACK已返回
#define TW_SR_ARB_LOST_SLA_ACK	0x68	//SLA+R/W 作为主机的仲裁失败；自己的SLA+W 已经被接收ACK 已返回
#define TW_SR_GCALL_ACK			0x70	//接收到广播地址ACK 已返回
#define TW_SR_ARB_LOST_GCALL_ACK 0x78	//SLA+R/W 作为主机的仲裁失败；接收到广播地址ACK已返回
#define TW_SR_DATA_ACK			0x80	//以前以自己的SLA+W被寻址；数据已经被接收ACK已返回
#define TW_SR_DATA_NACK			0x88	//以前以自己的SLA+W被寻址；数据已经被接收NOT ACK已返回
#define TW_SR_GCALL_DATA_ACK	0x90	//以前以广播方式被寻址；数据已经被接收ACK已返回
#define TW_SR_GCALL_DATA_NACK	0x98	//以前以广播方式被寻址；数据已经被接收NOT ACK已返回
#define TW_SR_STOP				0xA0	//在以从机工作时接收到STOP或重复START
 
 
//从发送状态码
#define TW_ST_SLA_ACK			0xA8	//自己的SLA+R 已经被接收ACK 已返回
#define TW_ST_ARB_LOST_SLA_ACK	0xB0	//SLA+R/W 作为主机的仲裁失败；自己的SLA+R 已经被接收ACK 已返回
#define TW_ST_DATA_ACK			0xB8	//TWDR 里数据已经发送接收到ACK
#define TW_ST_DATA_NACK			0xC0	//TWDR 里数据已经发送接收到NOT ACK
#define TW_ST_LAST_DATA			0xC8	//TWDR 的一字节数据已经发送(TWAE = “0”);接收到ACK
 
 
//其它状态码
#define TW_NO_INFO				0xF8	//没有相关的状态信息；TWINT = “0”
#define TW_BUS_ERROR			0x00	//由于非法的START 或STOP 引起的总线错误


// defines and constants 
#define TWCR_CMD_MASK     0x0F 
#define TWSR_STATUS_MASK  0xF8 

/***********************************************/
//常用TWI操作(从模式写和从模式读)
/***********************************************/
//TWSR--Twi_状态寄存器,检查TWI状态,应该将预分频位屏蔽(第三位是保留位)
#define Test_Twsr() 	  (TWSR&0xf8)
//查询模式下等待中断发生
#define Twi_WaitForComplete()          {while(!(TWCR&(1<<TWINT)));}
//清除中断标志位,使能TWI功能,开放TWI中断,在主控接收状态下对SDA线作应答
#define Twi_Ack()	  {TWCR=(TWCR&TWCR_CMD_MASK)|(1<<TWEA)|(1<<TWINT);}
//清除中断标志位,使能TWI功能,开放TWI中断,在主控接收状态下不对SDA线作应答
#define Twi_NoAcK()	  {TWCR=(TWCR&TWCR_CMD_MASK)|(1<<TWINT);}
//写入8位数据到数据寄存器中,同时清除中断标志位，使能TWI功能
#define Twi_SendByte(x)		{TWDR=(x);TWCR=(TWCR&TWCR_CMD_MASK)|(1<<TWINT);}
//清除中断标志位，在总线上发出终止信号，激活TWI功能，
#define Twi_Stop()		  TWCR=(TWCR&TWCR_CMD_MASK)|(1<<TWINT)|(1<<TWEA)|(1<<TWSTO)
//清除中断标志位，在总线上发出起始信号，激活TWI功能，开放TWI中断    注意是否自动产生ACK （TWEA）
#define Twi_Start()		  TWCR=(TWCR&TWCR_CMD_MASK)|(1<<TWINT)|(1<<TWSTA)
//设置本机地址(从机方式)
#define Twi_SetLocalDeviceAddr(deviceAddr, genCallEn)   TWAR=((deviceAddr)&0xFE)|((genCallEn)&0x01)
//功能描述:返回总线状态
#define Twi_GetState()    Twi_State


//-----------4个I2总线公用函数, 可供其它I2总线器件的程序调用--------------

void  i2c_start(void);	    //总线上起动开始条件
unsigned char i2c_write(unsigned char a);	//把一个字节数据输入器件, 返回TWI状态
unsigned char i2c_read(void);		//i2c读
void  i2c_stop(void);		//总线上起动停止条件 
unsigned char i2c_write_addr(unsigned char addr,unsigned char r_w);
unsigned char i2c_write_data(unsigned char data);
//------------------------------------------------------------------------
//发送给指定从机一个数据
//addr为从机地址，data数据
//#include "Device.c"
#endif
