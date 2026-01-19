<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
  <xsl:output method="html" omit-xml-declaration="yes" />
  <xsl:include href="common.xsl"/>
  <xsl:param name="argLanguageCode"/>
  <xsl:template match="Member">
  <xsl:text disable-output-escaping="yes"><![CDATA[<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">]]></xsl:text>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" >
  <head>
    <meta http-equiv="content-type" content="text/html; charset=iso-8859-1" />
    <meta name="author" content="Frederic Savard" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
    <title>Clinique de psychologie Urbania</title>
    <link rel="stylesheet" href="css/ui.css" />
    <link rel="stylesheet" href="css/style.css" />
    <script>
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
                (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
              m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
      ga('create', 'UA-40245323-1', 'psychologie-urbania.com');
      ga('send', 'pageview');
    </script>
  </head>
  <body>
    <xsl:variable name="page" select="Language[@code=$argLanguageCode]/Page"/>
    <xsl:variable name="summary" select="Language[@code=$argLanguageCode]/Summary"/>
    <xsl:variable name="academic" select="Language[@code=$argLanguageCode]/Academic"/>
    <div class="introContainer">
      <div id="intro">
        <div class="logo">Clinique de Psychologie Urbania</div>
        <div class="navigationHeader">
          <p>
            <xsl:text disable-output-escaping="yes"><![CDATA[<span><a href="./">accueil</a><a class="currentpage" href="team">équipe</a><a href="services">services</a><a href="career">carrière</a><a href="contact">contact</a><a href="links">liens</a></span>]]></xsl:text>
          </p>
        </div>
      </div>
    </div>
    <div class="mainContainer">
      <div class="content">
        <div class="header">
        <xsl:if test="count(Language) > 1">
          <div class="navigationHeader language">
            <xsl:for-each select="Language">
              <xsl:text disable-output-escaping="yes"><![CDATA[<a class="]]></xsl:text>
              <xsl:if test="@code=$argLanguageCode">
                currentpage
              </xsl:if>
              <xsl:text disable-output-escaping="yes"><![CDATA[" href="]]></xsl:text>
              <xsl:value-of select="../PageName"/>
              <xsl:if test="@code!=''">-<xsl:value-of select="@code"/></xsl:if>
              <xsl:text disable-output-escaping="yes"><![CDATA[">]]></xsl:text>
              <xsl:value-of select="@name"/>
              <xsl:text disable-output-escaping="yes"><![CDATA[</a>]]></xsl:text>
            </xsl:for-each>
          </div>
        </xsl:if>
          <h3>
            <span><xsl:value-of select="Name"/>, <span ><xsl:value-of select="$academic"/></span></span>
          </h3>
        </div>
        <div class="cf">
          <div class="col2_66_33">
            <div class="section cf">
              <xsl:text disable-output-escaping="yes"><![CDATA[<div class="memberPhotoWrap"><div class="memberPhoto" style="background-image:url(']]></xsl:text><xsl:value-of select="Photo"/><xsl:text disable-output-escaping="yes"><![CDATA[')"></div></div>]]></xsl:text>
            </div>

            <div class="section cf">
              <div id="contactus">
                <h1>
                  <span>Contact</span>
                </h1>
                <xsl:if test="PhoneNumber!=''">
                  <xsl:text disable-output-escaping="yes"><![CDATA[&nbsp;]]></xsl:text>
                  <p>Tel:</p>
                  <h2>
                    <span class="texthighlightcolor"><xsl:text disable-output-escaping="yes"><![CDATA[<div class="icon icon-phone"></div>]]></xsl:text><xsl:value-of select="PhoneNumber"/></span>
                  </h2>
                </xsl:if>
                <xsl:if test="EmailAddress!=''">
                  <xsl:text disable-output-escaping="yes"><![CDATA[&nbsp;]]></xsl:text>
                  <p>Courriel:</p>
                  <h2>
                    <span class="texthighlightcolor">
                      <xsl:text disable-output-escaping="yes"><![CDATA[<a href="mailto:]]></xsl:text><xsl:value-of select="EmailAddress"/><xsl:text disable-output-escaping="yes"><![CDATA["><div class="icon icon-envelope"></div>]]></xsl:text><xsl:value-of select="EmailAddress"/><xsl:text disable-output-escaping="yes"><![CDATA[</a>]]></xsl:text>
                    </span>
                  </h2>
                </xsl:if>
                <xsl:if test="WebSite!=''">
                  <xsl:text disable-output-escaping="yes"><![CDATA[&nbsp;]]></xsl:text>
                  <p>Liens:</p>
                  <h2>
                    <span class="texthighlightcolor">
                      <xsl:text disable-output-escaping="yes"><![CDATA[<a href="]]></xsl:text><xsl:value-of select="WebSite"/><xsl:text disable-output-escaping="yes"><![CDATA["><div class="icon icon-globe"></div>Site web]]></xsl:text><xsl:text disable-output-escaping="yes"><![CDATA[</a>]]></xsl:text>
                    </span>
                  </h2>
                </xsl:if>
              </div>
            </div>
          </div>
          <div class="col1_66_33">
            <xsl:for-each select="$page/Section">
              <xsl:if test="Title!=''">
                <div class="section cf">
                  <div class="header lightgray">
                    <h3>
                      <span>
                        <xsl:value-of select="Title"/>
                      </span>
                    </h3>
                  </div>
                </div>
              </xsl:if>
              <div class="sectiontext">
                <xsl:call-template name="replace-linefeed">
                  <xsl:with-param name="text" select="Desciption" />
                </xsl:call-template>
              </div>
            </xsl:for-each>
            <hr/>
            <div class="sectiontext warning">
              NOTE: Les informations présentées sur cette page sont sous la responsabilité de leur auteur. La Clinique de psychologie Urbania n'intervient pas dans le contenu des pages personnelles ni dans la pratique des professionnels.
            </div>
          </div>
        </div>


          <hr/>
          <div class="sectiontext copyright">
              Copyright 2026 © Clinique de Psychologie Urbania. Tous droits réservés.
          </div>
      </div>
    </div>

  </body>
</html>
  </xsl:template>
</xsl:stylesheet>