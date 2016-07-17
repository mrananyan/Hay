 <?php
/**********************************************************************************************************************
* ArmStyle - PHP Template Engine է: Այս կոդը կարող են օգտագործել միայն հայերը միայն հայկական նախագծերում
* Տարբերակ: 1.0.0
* Հեղինակ: Սարգիս Անանյան
* Էլ. հասցե: saqoananyan@gmail.com
* Հեռ. 1: 096-22-42-19
* Հեռ. 2: 091-22-42-19
* Facebook: https://www.facebook.com/MrAnanyan
* Web Site: http://MixNet.AM


               AAA                                                          SSSSSSSSSSSSSSS     tttt                            lllllll
              A:::A                                                       SS:::::::::::::::S ttt:::t                            l:::::l
             A:::::A                                                     S:::::SSSSSS::::::S t:::::t                            l:::::l
            A:::::::A                                                    S:::::S     SSSSSSS t:::::t                            l:::::l
           A:::::::::A         rrrrr   rrrrrrrrr     mmmmmmm    mmmmmmm  S:::::S       ttttttt:::::ttttttyyyyyyy           yyyyyyl::::l    eeeeeeeeeeee
          A:::::A:::::A        r::::rrr:::::::::r  mm:::::::m  m:::::::mmS:::::S       t:::::::::::::::::ty:::::y         y:::::yl::::l  ee::::::::::::ee
         A:::::A A:::::A       r:::::::::::::::::rm::::::::::mm::::::::::mS::::SSSS    t:::::::::::::::::t y:::::y       y:::::y l::::l e::::::eeeee:::::ee
        A:::::A   A:::::A      rr::::::rrrrr::::::m::::::::::::::::::::::m SS::::::SSSStttttt:::::::tttttt  y:::::y     y:::::y  l::::le::::::e     e:::::e
       A:::::A     A:::::A      r:::::r     r:::::m:::::mmm::::::mmm:::::m   SSS::::::::SS   t:::::t         y:::::y   y:::::y   l::::le:::::::eeeee::::::e
      A:::::AAAAAAAAA:::::A     r:::::r     rrrrrrm::::m   m::::m   m::::m      SSSSSS::::S  t:::::t          y:::::y y:::::y    l::::le:::::::::::::::::e
     A:::::::::::::::::::::A    r:::::r           m::::m   m::::m   m::::m           S:::::S t:::::t           y:::::y:::::y     l::::le::::::eeeeeeeeeee
    A:::::AAAAAAAAAAAAA:::::A   r:::::r           m::::m   m::::m   m::::m           S:::::S t:::::t    tttttt  y:::::::::y      l::::le:::::::e
   A:::::A             A:::::A  r:::::r           m::::m   m::::m   m::::SSSSSSS     S:::::S t::::::tttt:::::t   y:::::::y      l::::::e::::::::e
  A:::::A               A:::::A r:::::r           m::::m   m::::m   m::::S::::::SSSSSS:::::S tt::::::::::::::t    y:::::y       l::::::le::::::::eeeeeeee
 A:::::A                 A:::::Ar:::::r           m::::m   m::::m   m::::S:::::::::::::::SS    tt:::::::::::tt   y:::::y        l::::::l ee:::::::::::::e
AAAAAAA                   AAAAAArrrrrrr           mmmmmm   mmmmmm   mmmmmmSSSSSSSSSSSSSSS        ttttttttttt    y:::::y         llllllll   eeeeeeeeeeeeee
                                                                                                               y:::::y
                                                                                                              y:::::y
                                                                                                             y:::::y
                                                                                                            y:::::y
                                                                                                           yyyyyyy


*********************************************************************************************************************/
$block_data = 0;
class ArmStyle
        {
                public function display($name, $var)
                        {
                                if (is_array($var) && count($var))
                                        {
                                                foreach ($var as $key => $key_var)
                                                        {
                                                                $this->display($key, $key_var);
                                                        }
                                        }
                                else
                                                $this->data[$name] = $var;
                        }
                public function display_block($name, $var)
                        {
                                if (is_array($var) && count($var))
                                        {
                                                foreach ($var as $key => $key_var)
                                                        {
                                                                $this->display_block($key, $key_var);
                                                        }
                                        }
                                else
                                                $this->block_data[$name] = $var;
                        }
                public function front_end($arm_name)
                        {
                                $time_before = $this->get_real_time();
                                if ($arm_name == '' || !file_exists($this->dir . DIRECTORY_SEPARATOR . $arm_name))
                                        {
                                                die("<b>" . $arm_name . '</b> - Ֆայլը գոյություն չունի: </br><b>1.</b> Ստուգեք ֆայլի անունը <b>PHP</b> կոդում: </br><b>2.</b> Ստուգեք ֆայլի թույլտվությունը (<b>CHMOD</b>): </br><b>3.</b> Ստուգեք ֆայլի առկայությունը սերվերում: </br></br></br><hr><center><b>Շնորհակալություն ArmStyle-ից օգտվելու համար!</b></center><hr>');
                                                return false;
                                        }
                                $this->template = file_get_contents($this->dir . DIRECTORY_SEPARATOR . $arm_name);
                                if (stristr($this->template, "{include file="))
                                        {
                                                $this->template = preg_replace("#\\{include file=['\"](.+?)['\"]\\}#ies", "\$this->combine('\\1')", $this->template);
                                        }
                                $this->copy_template = $this->template;
                                return true;
                        }
                public function combine($arm_name)
                        {
                                if ($arm_name == '' || !file_exists($this->dir . DIRECTORY_SEPARATOR . $arm_name))
                                        {
                                                die("<b>" . $arm_name . '</b> - Ֆայլը գոյություն չունի: </br><b>1.</b> Ստուգեք ֆայլի անունը <b>PHP</b> կոդում: </br><b>2.</b> Ստուգեք ֆայլի թույլտվությունը (<b>CHMOD</b>): </br><b>3.</b> Ստուգեք ֆայլի առկայությունը սերվերում: </br></br></br><hr><center><b>Շնորհակալություն ArmStyle-ից օգտվելու համար!</b></center><hr>');
                                                return false;
                                        }
                                $template = file_get_contents($this->dir . DIRECTORY_SEPARATOR . $arm_name);
                                return $template;
                        }
                public function _clear()
                        {
                                $this->data          = array();
                                $this->block_data    = array();
                                $this->copy_template = $this->template;
                        }
                public function clear()
                        {
                                $this->data          = array();
                                $this->block_data    = array();
                                $this->copy_template = null;
                                $this->template      = null;
                        }
                public function global_clear()
                        {
                                $this->data          = array();
                                $this->block_data    = array();
                                $this->result        = array();
                                $this->copy_template = null;
                                $this->template      = null;
                        }
                public function compile($arm)
                        {
                                $time_before = $this->get_real_time();
                                foreach ($this->data as $key_find => $key_replace)
                                        {
                                                $find[]    = $key_find;
                                                $replace[] = $key_replace;
                                        }
                                $result = str_replace($find, $replace, $this->copy_template);
                                if (isset($this->result[$arm]))
                                                $this->result[$arm] .= $result;
                                else
                                                $this->result[$arm] = $result;
                                $this->_clear();
                        }
                public function get_real_time()
                        {
                                list($seconds, $microSeconds) = explode(' ', microtime());
                                return ((float) $seconds + (float) $microSeconds);
                        }
        }
?>
