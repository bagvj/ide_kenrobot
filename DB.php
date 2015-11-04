<?php
/**
 * @name DB
 * @desc DB operator
 * @author Hivon
 */
class DB{
	private $_db=null;
	private $_server_name="127.0.0.1";
	private $_port="3306";
	private $_username="root";
	// private $_password="/y9of8BRq";
	private $_password="string";
	
	public function __construct($db){
		$this->_db=mysqli_init();
		if (!$this->_db){
			die("mysqli_init failed");
		}
		if(!mysqli_real_connect($this->_db,$this->_server_name.":".$this->_port,$this->_username,$this->_password,$db)){
			die("Connect Error: " . mysqli_connect_error());
		}
		// $this->_db=new mysqli($this->_server_name.":".$this->_port,$this->_username,$this->_password,$db);
		$this->_db->set_charset('utf8');
	}

	/**
	 * @desc 数据库查询
	 * @param string strTable 数据库表
	 * @param array arrFields 要查询的字段
	 * @param array arrConds 查询条件
	 * @param array arrAppends 查询附属条件
	 * @return array 查询结果
	 */
	public function select($strTable,$arrFields=array("*"),$arrConds=array(),$arrAppends=array()){
		$strFields=self::arrToStr($arrFields);
		$strConds=self::arrToStr($arrConds,"and",false);
		$strAppends=self::arrToStr($arrAppends,'');

		$strSql="SELECT $strFields FROM $strTable";
		if(strlen($strConds)>0){
			$strSql.=" WHERE $strConds";
		}
		$strSql.=" $strAppends";
		error_log($strSql);
		$res=$this->_db->query($strSql);
		
        $ret = array();
        while($row = $res->fetch_assoc()){
            $ret[] = $row;
        }
        $res->free();

		return $ret;
	}

	/**
	 * @desc 插入
	 * @param string strTable 数据库表
	 * @param array arrFields 要查询的字段
	 * @param boolean onDup 已存在是否覆盖插入
	 * @return int 影响行数
	 */
	public function insert($strTable,$arrFields,$onDup=false){
		$strFields=self::arrToStr($arrFields);

		$strSql="INSERT $strTable SET $strFields";
		if(!empty($onDup) && $onDup){
			$strSql.=" ON DUPLICATE KEY UPDATE $strFields";
		}
		// error_log($strSql);
		$this->_db->query($strSql);

		return mysqli_affected_rows($this->_db);
	}

	/**
	 * @desc 删除
	 * @param string strTable 数据库表
	 * @param array arrConds 查询条件
	 * @return int 影响行数
	 */
	public function delete($strTable,$arrConds=array()){
		$strConds=self::arrToStr($arrConds,'and',false);

		$strSql="DELETE FROM $strTable";
		if(strlen($strConds)>0){
			$strSql.=" WHERE $strConds";
		}

		$this->_db->query($strSql);

		return mysqli_affected_rows($this->_db);
	}

	/**
	 * @desc 更新
	 * @param string strTable 数据库表
	 * @param array arrFields 要查询的字段
	 * @param array arrConds 查询条件
	 * @param array arrAppends 查询附属条件
	 * @return int 影响行数
	 */
	public function update($strTable,$arrFields,$arrConds=array(),$arrAppends=array()){
		$strFields=self::arrToStr($arrFields);
		$strConds=self::arrToStr($arrConds,"and",false);
		$strAppends=self::arrToStr($arrAppends,'');

		$strSql="UPDATE $strTable SET $strFields";
		if(strlen($strConds)>0){
			$strSql.=" WHERE $strConds";
		}
		if(strlen($strAppends)>0){
			$strSql.=" $strAppends";
		}
		// error_log($strSql);
		$this->_db->query($strSql);

		return mysqli_affected_rows($this->_db);
	}

	/**
	 * @desc 执行指定的sql
	 * @param string strSql
	 * @return int 影响行数
	 */
	public function query($strSql){
		$this->_db->query($strSql);
		return mysqli_affected_rows($this->_db);
	}

	/**
	 * @desc 开始事务
	 * @param null
	 * @return this->_db->query($strSql)
	 */
	public function startTransaction(){
		$strSql="START TRANSACTION";
		return $this->_db->query($strSql);
	}

	/**
	 * @desc 提交事务
	 * @param null
	 * @return this->_db->commit()
	 */
	public function commit(){
		return $this->_db->commit();
	}

	/**
	 * @desc 回滚
	 * @param null
	 * @return this->_db->rollback()
	 */
	public function rollback(){
		return $this->_db->rollback();
	}

	/**
	 * @desc 获取最新插入最新id
	 * @param null
	 * @return mysqli_insert_id
	 */
	public function mysqli_insert_id(){
		return mysqli_insert_id($this->_db);
	}

	/**
	 * @desc 根据指定分隔符将数组转换为字符串
	 * @param array array
	 * @param string splitter
	 * @return string returnStr
	 */
	private function arrToStr($array,$splitter=',',$useEqual=true){
		$returnStr="";
		if(count($array)==0)return "";
		foreach ($array as $key => $value) {
			if(strlen($returnStr)>0){
				$returnStr.=' '.$splitter.' ';
			}
			if(is_numeric($key)){
				$returnStr.=$value;
			}else{
				if($useEqual){
					$returnStr.=$key."='".$this->_db->real_escape_string($value)."'";
				}else{
					$returnStr.=$key."'".$this->_db->real_escape_string($value)."'";
				}
			}
		}

		return $returnStr;
	}

}




