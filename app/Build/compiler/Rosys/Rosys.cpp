#include "Rosys.h"


volatile unsigned char *PORT[]={&PORTA,&PORTB,&PORTC,&PORTD,&PORTE,&PORTF,&PORTG};
volatile unsigned char *PIN[]={&PINA,&PINB,&PINC,&PIND,&PINE,&PINF,&PING};
volatile unsigned char *DDR[]={&DDRA,&DDRB,&DDRC,&DDRD,&DDRE,&DDRF,&DDRG};
volatile unsigned long g_Time_Ms=0;
volatile unsigned long ledst=0;
#ifdef __Motor_USE
#ifdef __ST_USE
unsigned char StepPort[2],StepHigh[2],StepMode[2],StepSta[2];
#endif
#endif
#ifdef __LDM_USE
unsigned char LinePort,RedPort,GreenPort;
#endif
#ifdef __KEY_USE
unsigned char KdmPort;
#endif
#ifdef  __USART_USE
volatile static unsigned char UART_RxBuf[UART_RX_BUFFER_SIZE];
volatile static unsigned char UART_RxHead;
volatile static unsigned char UART_RxTail;
volatile static unsigned char UART_TxBuf[UART_TX_BUFFER_SIZE];
volatile static unsigned char UART_TxHead;
volatile static unsigned char UART_TxTail;

volatile static unsigned char UART0_RxBuf[UART_RX_BUFFER_SIZE];
volatile static unsigned char UART0_RxHead;
volatile static unsigned char UART0_RxTail;
volatile static unsigned char UART0_TxBuf[UART_TX_BUFFER_SIZE];
volatile static unsigned char UART0_TxHead;
volatile static unsigned char UART0_TxTail;

///////////////////////////////////////
//函数名称：uart_init
//函数类型：void 
//函数作用：初始化Atmega128中的串行通讯模块
//参数：
//unsigned char id：通讯模块ID，Atmega128中有两个串行通讯模块
//unsigned char bandindex：波特率ID，在14.7456M下，串口的波特率是4800，9600，19200，38400，57600，115200
//unsigned char p：校验方式ID，奇校验、偶校验、无校验
///////////////////////////////////////
void uart_init(unsigned char id,unsigned char bandindex,unsigned char p)
{
	unsigned char ledbr[]={191,95,47,23,15,7};
	unsigned char pp[]={0x30,0x20,0x00};
	if(id)
	{
		UCSR1B = 0x00; //disable while setting baud rate
		UCSR1A = 0x00;
		UCSR1C = 0x06 + pp[p];
		UBRR1L = ledbr[bandindex]; //set baud rate lo
		UBRR1H = 0x00; //set baud rate hi
		UCSR1B = 0x98;
	}
	else
	{
		UCSR0B = 0x00; //disable while setting baud rate
		UCSR0A = 0x00;
		UCSR0C = 0x06 + pp[p];
		UBRR0L = ledbr[bandindex]; //set baud rate lo
		UBRR0H = 0x00; //set baud rate hi
		UCSR0B = 0x98;
	}
}
///////////////////////////////////////
//中断函数
//中断源：SIG_UART1_RECV
//中断描述：串行口1接收中断
///////////////////////////////////////
//SIGNAL(SIG_UART1_RECV)
ISR(USART1_RX_vect)
{
	unsigned char data;
	unsigned char tmphead;
	data=UDR1;
	tmphead=(UART_RxHead+1)&UART_RX_BUFFER_MASK;
	UART_RxHead=tmphead;
	UART_RxBuf[tmphead]=data;
}
///////////////////////////////////////
//中断函数
//中断源：SIG_UART0_RECV
//中断描述：串行口0接收中断
///////////////////////////////////////
//SIGNAL(SIG_UART0_RECV)
ISR(USART0_RX_vect)
{
	unsigned char data;
	unsigned char tmphead;
	data=UDR0;
	tmphead=(UART0_RxHead+1)&UART_RX_BUFFER_MASK;
	UART0_RxHead=tmphead;
	UART0_RxBuf[tmphead]=data;
}
///////////////////////////////////////
//中断函数
//中断源：SIG_UART1_DATA
//中断描述：串行口1数据空中断，用于发送数据
///////////////////////////////////////
//SIGNAL(SIG_UART1_DATA)
ISR(USART1_TX_vect)
{
	unsigned char tmptail;
	if(UART_TxHead!=UART_TxTail)
	{
		tmptail=(UART_TxTail+1)&UART_TX_BUFFER_MASK;
		UART_TxTail=tmptail;
		UDR1=UART_TxBuf[tmptail];
	}
	else
	{
		UCSR1B&=~(1<<UDRIE1);
	}
}
///////////////////////////////////////
//中断函数
//中断源：SIG_UART0_DATA
//中断描述：串行口0数据空中断，用于发送数据
///////////////////////////////////////
//SIGNAL(SIG_UART0_DATA)
ISR(USART0_TX_vect)
{
	unsigned char tmptail;
	if(UART0_TxHead!=UART0_TxTail)
	{
		tmptail=(UART0_TxTail+1)&UART_TX_BUFFER_MASK;
		UART0_TxTail=tmptail;
		UDR0=UART0_TxBuf[tmptail];
	}
	else
	{
		UCSR0B&=~(1<<UDRIE0);
	}
}
///////////////////////////////////////
//函数名称：uGetChar
//函数类型：unsigned char 
//函数作用：从串行口接收缓冲去中接收数据
//参数：
//unsigned char id：串口ID
///////////////////////////////////////
unsigned char uGetChar(unsigned char id)
{
	unsigned char tmptail;
	if(id)
	{
		if(UART_RxHead==UART_RxTail)return 0;
		 
		tmptail=(UART_RxTail+1)&UART_RX_BUFFER_MASK;
		UART_RxTail=tmptail;
		return UART_RxBuf[tmptail];
	}
	else
	{
		if(UART0_RxHead==UART0_RxTail)return 0;
		 
		tmptail=(UART0_RxTail+1)&UART_RX_BUFFER_MASK;
		UART0_RxTail=tmptail;
		return UART0_RxBuf[tmptail];
	}
}
///////////////////////////////////////
//函数名称：uPutChar
//函数类型：void 
//函数作用：将数据写入缓存区，等待串口发送
//参数：
//unsigned char id：串口ID
//unsigned char data：要发送的数据
///////////////////////////////////////
void uPutChar(unsigned char id,unsigned char data)
{
	unsigned char tmphead; 
	if(id)
	{
		tmphead=(UART_TxHead+1)&UART_TX_BUFFER_MASK;
		while(tmphead==UART_TxTail);
		UART_TxBuf[tmphead]=data;
		UART_TxHead=tmphead;
		UCSR1B|=(1<<UDRIE1);
	}
	else
	{
		tmphead=(UART0_TxHead+1)&UART_TX_BUFFER_MASK;
		while(tmphead==UART0_TxTail);
		UART0_TxBuf[tmphead]=data;
		UART0_TxHead=tmphead;
		UCSR0B|=(1<<UDRIE0);
	}
}
#endif
#ifdef __LDM_USE
///////////////////////////////////////
//函数名称：InitLDM
//函数类型：void
//函数作用：初始化LDM模块
//参数：
//unsigned char Line：COM端端口选择
//unsigned char Red：红色输出端端口选择
//unsigned char Green：绿色输出端口选择
///////////////////////////////////////
void InitLDM(unsigned char Line,unsigned char Red,unsigned char Green)
{
	LinePort=Line;
	RedPort=Red;
	GreenPort=Green;
	*DDR[LinePort]=*DDR[RedPort]=*DDR[GreenPort]=0xff;
	*PORT[LinePort]=0x00;
	*PORT[RedPort]=*PORT[GreenPort]=0xff;
}
///////////////////////////////////////
//函数名称：LDM
//函数类型：void
//函数作用：点亮LDM
//参数：
//unsigned char Line：列编号
//unsigned char Red：红色代码
//unsigned char Green：绿色代码
///////////////////////////////////////
void LDM(unsigned char Line,unsigned char Red,unsigned char Green)
{
	union
	{
		unsigned char x;
		struct
		{
			char bit0:1;
			char bit1:1;
			char bit2:1;
			char bit3:1;
			char bit4:1;
			char bit5:1;
			char bit6:1;
			char bit7:1;
		}b;
	}a,b;
	a.x=Green;
	b.b.bit0=a.b.bit7;
	b.b.bit1=a.b.bit6;
	b.b.bit2=a.b.bit5;
	b.b.bit3=a.b.bit4;
	b.b.bit4=a.b.bit3;
	b.b.bit5=a.b.bit2;
	b.b.bit6=a.b.bit1;
	b.b.bit7=a.b.bit0;
	Green=b.x;
	*PORT[LinePort]=1<<(Line&7);
	*PORT[RedPort]=~Red;
	*PORT[GreenPort]=~Green;
	delay_ms(2);
}
#endif
#ifdef __INT_USE
///////////////////////////////////////
//函数名称：InitInt
//函数类型：void 
//函数作用：初始化外部中断
//参数：
//unsigned char index：外部中断源编号
//unsigned char enabled：1使能，0禁止
//unsigned char mode：模式，上升沿与下降沿
///////////////////////////////////////
void InitInt(unsigned char index,unsigned char enabled,unsigned char mode)
{
//EICRB EICRA：中断控制寄存器，每两位控制一个中断，四种方式是：低电平、保留、下降沿、上升沿
	unsigned int eicr=(((int)(EICRB))<<8)|EICRA;
	eicr&=~(3<<(index<<1));
	eicr|=mode<<(index<<1);
	EICRA=eicr;
	EICRB=eicr>>8;
//EIMSK：中断屏蔽寄存器
	if(enabled)
		EIMSK|=BIT(index);
	else
		EIMSK&=~BIT(index);
}
#endif
#ifdef __KEY_USE
///////////////////////////////////////
//函数名称：initKdm
//函数类型：void 
//函数作用：初始化键盘阵列
//参数：
//unsigned char kdm：键盘所接入的IO口编号
///////////////////////////////////////
void initKdm(unsigned char kdm)
{
	KdmPort=kdm;
	*DDR[kdm]=0x0f;
	*PORT[kdm]=0xf0;
}
///////////////////////////////////////
//函数名称：KeyScan
//函数类型：int 
//函数作用：扫描键盘。返回键值0到0xf，如果无按键返回-1
//参数：
///////////////////////////////////////
int KeyScan()
{
	unsigned char i;
	unsigned char c;
	*DDR[KdmPort]=0xf0;
	*PORT[KdmPort]=0x0f;
	asm(""NOP"");
	asm(""NOP"");
	asm(""NOP"");
	asm(""NOP"");
	c=*PIN[KdmPort]&0x0f;
	if(c==0x0f)return 16;
	for(i = 4; i < 8; i++)
	{
		*PORT[KdmPort]=~(1<<i);
		delay_ms(2);
		c = ((*PIN[KdmPort])^ 0x0f) & 0x0f;
		if(c)
		{
			if(c & 1)
				c = 0;
			else if(c & 2)
				c = 1;
			else if(c & 4)
				c = 2;
			else if(c & 8)
				c = 3;
			return i+c*4-4;
		}
	}
	return 16;
}
#endif
#ifdef __Motor_USE
#ifdef __ST_USE
///////////////////////////////////////
//函数名称：initStep
//函数类型：void 
//函数作用：初始化步进电机
//参数：
//unsigned char step：bit7：电机编号
//                    bit6：模式 0单双八拍方式，1单四拍方式
//                    bit5~3：电机接入端口编号
//                    bit2：电机接入端口高低位
///////////////////////////////////////
void initStep(unsigned char step)
{
	unsigned char Index=0;
	if(step&0x80)Index=1;
	StepMode[Index]=step&0x40?4:8;
	StepPort[Index]=(step>>3)&7;
	StepHigh[Index]=step&0x4?1:0;
	StepSta[Index]=0;
}

#endif
#ifdef __RC_USE
///////////////////////////////////////
//函数名称：Servo
//函数类型：void 
//函数作用：改变伺服电机运动状态
//参数：
//unsigned char Index：电机编号
//int Degree：电机角度
///////////////////////////////////////
void Servo(unsigned char Index,int Degree)
{
	unsigned int ocr;
	if(Degree>90)Degree=90;
	if(Degree<-90)Degree=-90;
	ocr=RC_ZERO+Degree*RC_DEGREE;
	if(Index==0)
	{
		OCR1A=ocr;
	}
	else if(Index==1)
	{
		OCR1B=ocr;
	}
#ifdef __TWI_USE
	else if(Index<8)
	{
		unsigned char i = 0;
		int us = 10;
		for(i=0;i<6;i++)
		{
			i2c_maste_transt(0x10, 170);
			delay_ms(1);
		}
		i2c_maste_transt(0x10, Index-2);
		delay_ms(1);
		us = us * Degree;
		us = us + 1500;
		i = us % 256;
		i2c_maste_transt(0x10, i);
		delay_ms(1);
		i = us / 256;
		i2c_maste_transt(0x10, i);
		delay_ms(1);
		i2c_maste_transt(0x10, 187);
	}
	else
	{
		unsigned char i = 0;
		int us = 10;
		for(i=0;i<6;i++)
		{
			i2c_maste_transt(0x20, 170);
			delay_ms(1);
		}
		i2c_maste_transt(0x20, Index-8);
		delay_ms(1);
		us = us * Degree;
		us = us + 1500;
		i = us % 256;
		i2c_maste_transt(0x20, i);
		delay_ms(1);
		i = us / 256;
		i2c_maste_transt(0x20, i);
		delay_ms(1);
		i2c_maste_transt(0x20, 187);
	}
#endif
}
///////////////////////////////////////
//函数名称：InitServo
//函数类型：void 
//函数作用：初始化伺服电机
///////////////////////////////////////
void InitServo()
{
	DDRB=0XFF;
	PORTB=0XFF;
	TCCR1A=0xF0;
	TCCR1B=0x12;
	ICR1H=(unsigned char)(RC_CIRCLE>>8);
	ICR1L=(unsigned char)(RC_CIRCLE&0xff);
	OCR1AH=(unsigned char)(RC_ZERO>>8);
	OCR1AL=(unsigned char)(RC_ZERO&0xff);
	OCR1BH=(unsigned char)(RC_ZERO>>8);
	OCR1BL=(unsigned char)(RC_ZERO&0xff);
	Servo(0,0);
	Servo(1,0);
	return;
}
#endif
#ifdef __DC_USE
///////////////////////////////////////
//函数名称：InitMotor
//函数类型：void 
//函数作用：初始化直流电机，使用8为定时器控制
///////////////////////////////////////
void InitMotor()
{
	TCCR0=0X79;
	TCCR2=0X79;
	TCNT0=TCNT2=0X00;
	OCR0=OCR2=0X00;
	DDRB=0XFF;
	PORTB=0XFF;
}
///////////////////////////////////////
//函数名称：_motor
//函数类型：void 
//函数作用：改变两个基本电机的运动状态
//参数：
//int left：第一个电机的方向与速度，绝对值表示速度，符号表示方向
//int right：第二个电机的方向与速度
///////////////////////////////////////
void _motor(int left,int right)
{
	int LeftSpeed,RightSpeed;
	unsigned char l,r;
	if(left>0&&left<0X100)
		l=LEFT_FORWORD;
	else if(left<0&&-left<0X100)
		l=LEFT_BACK;
	else
		l=0XFF;
	if(right>0&&right<0X100)
		r=RIGHT_FORWORD;
	else if(right<0&&-right<0X100)
		r=RIGHT_BACK;
	else
		r=0XFF;
	PORTB=l&r;
	LeftSpeed=left>0?left:-left;
	RightSpeed=right>0?right:-right;
	if(LeftSpeed>255)LeftSpeed=255;
	if(RightSpeed>255)RightSpeed=255;
	OCR0=LeftSpeed;
	OCR2=RightSpeed;
}
///////////////////////////////////////
//函数名称：DCMotor
//函数类型：void 
//函数作用：操作直流电机
//参数：
//int index：电机编号
//int speed：电机速度与方向
///////////////////////////////////////
void DCMotor(int index,int speed)
{
	static int s[2]={0};
	if(speed>255)speed=255;
	if(speed<-255)speed=-255;
	if (index<2)
	{
		s[index]=speed;
		_motor(s[0],s[1]);
	}
#ifdef __TWI_USE
	else if(index<8)
	{
		unsigned char i = 0;
		int us = 10;
		for(i=0;i<6;i++)
		{
			i2c_maste_transt(0x30, 170);
			delay_ms(1);
		}
		i2c_maste_transt(0x30, index-2);
		delay_ms(1);
		i=speed>0?speed:-speed;
		i2c_maste_transt(0x30, i);
		delay_ms(1);
		i=speed>0?1:0;
		i2c_maste_transt(0x30, i);
		delay_ms(1);
		i2c_maste_transt(0x30, 187);
	}
	else
	{
		unsigned char i = 0;
		int us = 10;
		for(i=0;i<6;i++)
		{
			i2c_maste_transt(0x20, 170);
			delay_ms(1);
		}
		i2c_maste_transt(0x20, index-8);
		delay_ms(1);
		us = us * speed;
		us = us + 1500;
		i = us % 256;
		i2c_maste_transt(0x20, i);
		delay_ms(1);
		i = us / 256;
		i2c_maste_transt(0x20, i);
		delay_ms(1);
		i2c_maste_transt(0x20, 187);
	}
#endif
}
#endif
#endif
#ifdef __NUM_USE

volatile unsigned char NumPort;
volatile unsigned int LedNum=0;

//unsigned char Led_Disbuf[10]={0x3F,0x06,0x5B,0x4F,0x66,0x6D,0x7D,0x07,0x7F,0x6F}; //共阴极
unsigned char Led_Disbuf[]={	//共阳数码管的编码
	0xC0,/*0*/
	0xF9,/*1*/
	0xA4,/*2*/
	0xB0,/*3*/
	0x99,/*4*/
	0x92,/*5*/
	0x82,/*6*/
	0xF8,/*7*/
	0x80,/*8*/
	0x90, /*9*/
};//共阳极
unsigned char ComBuf[] ={		//数码管位选编码，控制显示8位中的第几位
	0x01,
	0x02,
	0x04,
	0x08,
	0x10,
	0x20,
	0x40,
	0x80,
	0xFF,/*ALL ON*/
	0x00 /*OFF*/
};
//595端口初始化
//void HC595_port_init(void)
//{
//PORTG = 0x00;
//DDRG |= (1 << PG0) | (1 << PG1) | (1 << PG2) | (1 << PG4);
//}
//发送一个字节
void HC595_Send_Data(unsigned char byte)
{
	
	unsigned char i;
	(*PORT[NumPort] &= ~(1<<2));
	for(i = 0;i < 8;i++)
	{
		if(byte & 0x80)
		{
			(*PORT[NumPort] |= (1<<0));
		}
		else
		{
			(*PORT[NumPort] &= ~(1<<0));
		}
		(*PORT[NumPort] &= ~(1<<2));
		(*PORT[NumPort] |= (1<<2)); //上升沿数据移位
		(*PORT[NumPort] &= ~(1<<2));
		byte <<=1;
		
	}
}
//发送字符串
void HC595_Output_Data(unsigned char data,unsigned char Location)
{
	unsigned char OutByte;
	(*PORT[NumPort] &= ~(1<<2));
	(*PORT[NumPort] &= ~(1<<1)); //下降沿锁存器数据不变
	OutByte=ComBuf[Location-1];
	HC595_Send_Data(OutByte);
	
	OutByte=Led_Disbuf[data];
	HC595_Send_Data(OutByte);
	
	(*PORT[NumPort] &= ~(1<<1)); //下降沿锁存器数据不变
	(*PORT[NumPort] |= (1<<1)); //上升沿数据打入8位锁存器
	(*PORT[NumPort] &= ~(1<<1));
}


void InitNumLed(unsigned char Port)
{
	NumPort=Port;
	*DDR[Port]=0xff;
	*PORT[Port]=0x00;
}
void InitDelay()
{
	
	
}
///////////////////////////////////////
//函数名称：ToLed
//函数类型：void
//函数作用：LED数码管显示，D口高四位提供位选，第四位G口提供Bin编码
//参数：
//unsigned int l：显示的数字。
///////////////////////////////////////
void ToLed(unsigned int l)
{
	LedNum=l;
	ledst=1;
}

#endif

void initTimer3()
{
	TCNT3=0x0000;
	TCCR3B=0x01;
	OCR3A=14745;
	ETIMSK=0x10;
}

SIGNAL(TIMER3_COMPA_vect)
{
	#ifdef __NUM_USE
	static unsigned char ledind=0;
	unsigned char a[4];
	*DDR[NumPort] = 0xFF;
	
	if(ledst==1)
	{
		
		a[0]=LedNum%10;    //个位
		a[1]=(LedNum/10)%10;  //十位
		a[2]=(LedNum/100)%10;  //百位
		a[3]=(LedNum/1000)%10;  //千位
		switch(ledind)
		{
			case 0: HC595_Output_Data(a[0],4); break;
			case 1: HC595_Output_Data(a[1],3); break;
			case 2: HC595_Output_Data(a[2],2); break;
			case 3: HC595_Output_Data(a[3],1); break;
			default: break;
		}
		
		if(LedNum>999)
		ledind=(ledind+1)%4;
		else if(LedNum>99)
		ledind=(ledind+1)%3;
		else if(LedNum>9)
		ledind=(ledind+1)%2;
		else
		ledind=0;
	}
	#endif
	g_Time_Ms++;
	TCNT3=0x0000;
}
unsigned long get_Time()
{

	return g_Time_Ms;
}
///////////////////////////////////////
//函数名称：delay_ms
//函数类型：void
//函数作用：延时指定毫秒
//参数：
//unsigned int a：毫秒数
///////////////////////////////////////
void delay_ms(unsigned long a)
{
	unsigned long b=get_Time();

	while(get_Time()<a+b)
	{
	}
}
///////////////////////////////////////
//函数名称：IoOut
//函数类型：void 
//函数作用：io口整字节输出
//参数：
//unsigned char port：端口编号
//unsigned char value：要输出的值
///////////////////////////////////////
void IoOut(unsigned char port,unsigned char value)
{
	*DDR[port]=0xff;
	*PORT[port]=value;
}
///////////////////////////////////////
//函数名称：IoIn
//函数类型：unsigned char 
//函数作用：io口整字节输入，返回输入的值
//参数：
//unsigned char port：端口编号
///////////////////////////////////////
unsigned char IoIn(unsigned char port)
{
	*DDR[port]=0x00;
	return *PIN[port];
}
///////////////////////////////////////
//函数名称：read_adc
//函数类型：unsigned int 
//函数作用：AD转换，返回10位AD结果
//参数：
//unsigned char adc_input：AD接口编号
///////////////////////////////////////
unsigned int read_adc(unsigned char adc_input)
{
	// Set ADC input
	ADMUX = 0x40;
	ADCSRA = 0x87;
	ADMUX &= 0xE0;
	ADMUX |= adc_input;
	// Start ADC conversion
	ADCSRA |= 1 << ADSC;
	// Waiting for ADC conversion completed
	loop_until_bit_is_set(ADCSRA, ADIF);
	ADCSRA |= 1<< ADIF;

	return ADC;
}


///////////////////////////////////////
//函数名称：IoOutB
//函数类型：void 
//函数作用：按位输出
//参数：
//unsigned char address：端口编号
//int bit：位编号
//unsigned char val：值，非零输出高电平，零输出低电平。
///////////////////////////////////////
void IoOutB(unsigned char address,int bit,unsigned char val)
{
	unsigned char byte=1<<bit;
	*DDR[address]|=byte;
	if(val)
		*PORT[address]|=byte;
	else
		*PORT[address]&=~byte;
}
///////////////////////////////////////
//函数名称：IoInB
//函数类型：unsigned char 
//函数作用：按位读取IO口电平，返回非零高电平，零低电平
//参数：
//unsigned char address：端口编号
//int bit：位编号
///////////////////////////////////////
unsigned char IoInB(unsigned char address,int bit)
{
	unsigned char byte=1<<bit;
	*DDR[address]&=~byte;
	return *PIN[address]&byte?1:0;
}
unsigned char RemoteReceive(unsigned char address)
{
	*DDR[address] &= ~0x1f;
	*PORT[address] |= 0x1f;
	if (! (*PIN[address] & 0x10))
		return 16;
	return *PIN[address] & 0x0f;
}

#ifdef __TWI_USE
///////////////////////////////////////
//函数名称：twi_master_init
//函数类型：void 
//函数作用：主机方式初始化TWI模块
//参数：
//unsigned char band：波特率寄存器数值
//unsigned char twps：预分频器数值
///////////////////////////////////////
void twi_master_init(unsigned char band,unsigned char twps){
 TWCR= 0x00; //disable twi
 TWBR= band; //set bit rate
 TWSR= 0x00+twps; //set prescale
 TWAR= 0x00; //set slave address
 TWCR= 0x04; //enable twi
}
//总线上起动开始条件
void i2c_start(void){
	TWCR= (1<<TWINT)|(1<<TWSTA)|(1<<TWEN);
   	while (!(TWCR & (1<<TWINT))); //等待START 信号成功发送
}
//把一个字节数据输入器件, 返回TWI状态
//发送地址,r_w：1为读，0为写
unsigned char i2c_write_addr(unsigned char addr,unsigned char r_w)
{
 	if(r_w)
		TWDR = addr|r_w;     //RW 为1：读操作
	else
		TWDR = addr & 0xFE;   // RW 为0: 写操作
   	TWCR = (1<<TWINT)|(1<<TWEN); 
   	while (!(TWCR & (1<<TWINT)));
   	return(TWSR&0b11111000); //TWSR高五位为I2C工作状态。
}
//把一个字节数据输入器件, 返回TWI状态
//发送数据
unsigned char i2c_write_data(unsigned char data){
	TWDR = data;
   	TWCR = (1<<TWINT)|(1<<TWEN); 
   	while (!(TWCR & (1<<TWINT)));
   	return(TWSR&0b11111000); //TWSR高五位为I2C工作状态。
}
//从器件读出一个字节
unsigned char i2c_read(void){
   	TWCR = (1<<TWINT)|(1<<TWEN); 
	Twi_NoAcK();
	while (!(TWCR & (1<<TWINT)));
   	return(TWDR);
}
//总线上起动停止条件 
void i2c_stop(void) { 
   TWCR = (1<<TWINT)|(1<<TWSTO)|(1<<TWEN); 
}
///////////////////////////////////////
//函数名称：i2c_maste_transt
//函数类型：void 
//函数作用：主机发送数据
//操作步骤： 启动，发送地址，发送数据，关闭总线
//参数：
//unsigned char addr：从机地址
// unsigned char data：被发送的数据
///////////////////////////////////////
void i2c_maste_transt(unsigned char addr, unsigned char data){
	i2c_start();
 
	if(i2c_write_addr(addr, 0)==TW_MT_SLA_ACK) //发送地址成功并收到ACK
	{
		i2c_write_data(data);
		PORTD=PORTG=0x3f;
	}
	i2c_stop();
}
///////////////////////////////////////
//函数名称：i2c_maste_read
//函数类型：unsigned char 
//函数作用：主机主动读取从机中的数据
//操作步骤，启动，发送地址，读数据，关闭总线
//参数：
//unsigned char addr：从机地址
///////////////////////////////////////
unsigned char i2c_maste_read(unsigned char addr){
	unsigned char tmp=0; 
	i2c_start();
	if(i2c_write_addr(addr, 1)==TW_MR_SLA_ACK) //发送地址成功并收到ACK
	{
		tmp=i2c_read();
	}
	i2c_stop();
	return tmp;
}

///////////////////////////////////////
//函数名称：i2c_Ultr_Rag
//函数类型：unsigned char 
//函数作用：主机读取从机中的超声波测距传感器的数据
//参数：
//unsigned char addr：从机地址
///////////////////////////////////////
unsigned int i2c_Ultr_Rag(unsigned char addr){
	unsigned char miclow;
	unsigned char michi;
	unsigned int UltrRag;
	i2c_maste_transt(addr, 170);
	miclow = i2c_maste_read(addr);
    miclow=miclow&255;
	michi = i2c_maste_read(addr);
    michi=michi&255;
    UltrRag=michi*256+miclow;
	return UltrRag;
}
void i2c_Motor(unsigned char address,unsigned int MoterID,unsigned int speed, unsigned char dir){
		i2c_maste_transt(address, 0xaa);
		delay_ms(1);
		i2c_maste_transt(address, MoterID%2);
		delay_ms(1);
		i2c_maste_transt(address, speed & 0xff);
		delay_ms(1);
		i2c_maste_transt(address, dir);
		delay_ms(1);
		i2c_maste_transt(address,  0xbb);
		delay_ms(1);


}
///////////////////////////////////////
//函数名称：goStep
//函数类型：void 
//函数作用：驱动步进电机
//参数：
//unsigned char Index：电机编号
//unsigned char dir：电机转动方向
///////////////////////////////////////
void goStep(unsigned char address,unsigned int total,unsigned int speed, unsigned char mode, unsigned char dir)
{
	unsigned char i = 0;

	for(i=0;i<6;i++)
	{
		i2c_maste_transt(address, 170);
		delay_ms(1);
	}

	i2c_maste_transt(address, 0xaa);
	delay_ms(1);
	i2c_maste_transt(address, 0x02);
	delay_ms(1);
	i2c_maste_transt(address, total & 0xff);
	delay_ms(1);
	i2c_maste_transt(address, (total >> 8) & 0xff);
	delay_ms(1);
	i2c_maste_transt(address, 0xbb);
	delay_ms(1);

	i2c_maste_transt(address, 0xaa);
	delay_ms(1);
	i2c_maste_transt(address, 0x03);
	delay_ms(1);
	i2c_maste_transt(address, mode);
	delay_ms(1);
	i2c_maste_transt(address, dir);
	delay_ms(1);
	i2c_maste_transt(address, 0xbb);
	delay_ms(1);
	
	i2c_maste_transt(address, 0xaa);
	delay_ms(1);
	i2c_maste_transt(address, 0x04);
	delay_ms(1);
	i2c_maste_transt(address, speed & 0xff);
	delay_ms(1);
	i2c_maste_transt(address, (speed >> 8) & 0xff);
	delay_ms(1);
	i2c_maste_transt(address, 0xbb);
	delay_ms(1);
	
	i2c_maste_transt(address, 0xaa);
	delay_ms(1);
	i2c_maste_transt(address, 0x05);
	delay_ms(1);
	i2c_maste_transt(address, 0);
	delay_ms(1);
	i2c_maste_transt(address, 0);
	delay_ms(1);
	i2c_maste_transt(address, 0xbb);
	delay_ms(1);
}
void i2c_Servo(unsigned char address, unsigned char index, int degree)
{
	int us;
	us = 1500 + 10 * degree;
	i2c_maste_transt(address, 0xaa);
	delay_ms(1);
	i2c_maste_transt(address, index);
	delay_ms(1);
	i2c_maste_transt(address, us % 256);
	delay_ms(1);
	i2c_maste_transt(address, us / 256);
	delay_ms(1);
	i2c_maste_transt(address, 0xbb);
	delay_ms(1);
}
#endif
