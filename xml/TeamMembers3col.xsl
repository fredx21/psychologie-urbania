<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
  <xsl:output method="html"/>
  <xsl:include href="common.xsl"/>
  <xsl:template match="Team">
  <xsl:text disable-output-escaping="yes"><![CDATA[<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">]]></xsl:text>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" >
  <head>
    <meta http-equiv="content-type" content="text/html; charset=iso-8859-1" />
    <meta name="author" content="Frederic Savard" />
    <title>Clinique de psychologie Urbania</title>
    <link rel="stylesheet" href="css/ui.css" />
  </head>
  <body>
    <div id="container">
      <div id="intro">
        <div class="navigationHeader">
          <p>
            <xsl:text disable-output-escaping="yes"><![CDATA[<span><a href="./">accueil</a><a id="currentpage" href="team">équipe</a><a href="career">carrière</a><a href="services">services</a><a href="contact">contact</a></span>]]></xsl:text>
          </p>
        </div>
        <div id="bannerempty"></div>
      </div>

      <div>
        <div class="cf">
          <div class="header">
            <h3>
              <span>Notre équipe</span>
            </h3>
          </div>
        </div>

        <xsl:variable name="lastColumn">
          <xsl:value-of select="count(Member)-1"/>
        </xsl:variable>

        <!-- Write each members -->
        <xsl:for-each select="Member">
          <xsl:variable name="index">
            <xsl:value-of select="position()-1"/>
          </xsl:variable>
          <xsl:variable name="column">
            <xsl:value-of select="$index mod 3"/>
          </xsl:variable>
          <xsl:if test="$column = 0">
            <xsl:text disable-output-escaping="yes"><![CDATA[<div class="cf"><div class="col1 header memberIntroRow3Col">]]></xsl:text>
            <xsl:call-template name="WriteMember"/>
            <xsl:text disable-output-escaping="yes"><![CDATA[</div>]]></xsl:text>
          </xsl:if>
          <xsl:if test="$column = 1">
            <xsl:text disable-output-escaping="yes"><![CDATA[<div class="col23"><div class="col2 header memberIntroRow3Col">]]></xsl:text>
            <xsl:call-template name="WriteMember"/>
            <xsl:text disable-output-escaping="yes"><![CDATA[</div>]]></xsl:text>
          </xsl:if>
          <xsl:if test="$column = 2">
            <xsl:text disable-output-escaping="yes"><![CDATA[<div class="col3 header memberIntroRow3Col">]]></xsl:text>
            <xsl:call-template name="WriteMember"/>
            <xsl:text disable-output-escaping="yes"><![CDATA[</div></div></div>]]></xsl:text>
          </xsl:if>
        </xsl:for-each>

        <!-- Close div unmatched tags -->
        <xsl:if test="($lastColumn mod 3) = 1">
          <xsl:text disable-output-escaping="yes"><![CDATA[</div>]]></xsl:text>
        </xsl:if>

        <!-- Close class="cf" from index 0 -->
        <xsl:if test="$lastColumn > 0">
          <xsl:text disable-output-escaping="yes"><![CDATA[</div>]]></xsl:text>
        </xsl:if>
      </div>
    </div>
  </body>
</html>
  </xsl:template>

  <!-- Write a member HTML -->
  <xsl:template name="WriteMember">
    <xsl:text disable-output-escaping="yes"><![CDATA[<img src="]]></xsl:text><xsl:value-of select="Photo"/><xsl:text disable-output-escaping="yes"><![CDATA["/>]]></xsl:text>
    <h3><span><xsl:value-of select="Name"/></span></h3>
    <p><xsl:value-of select="Summary"/></p>
    <xsl:text disable-output-escaping="yes"><![CDATA[<a class="memberLink" href="]]></xsl:text><xsl:value-of select="Page"/><xsl:text disable-output-escaping="yes"><![CDATA["><p>détails</p></a>]]></xsl:text>
  </xsl:template>


</xsl:stylesheet>