<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
  <xsl:output method="html" />
  <xsl:include href="common.xsl" />
  <xsl:param name="argLanguageCode" />
  <xsl:template match="Team">
    <xsl:text disable-output-escaping="yes"><![CDATA[<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">]]></xsl:text>
<html xmlns="http://www.w3.org/1999/xhtml"
      xml:lang="en">
      <head>
        <meta http-equiv="content-type" content="text/html; charset=iso-8859-1" />
        <meta name="author" content="Frederic Savard" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
        <title>Clinique de psychologie Urbania</title>
        <link rel="stylesheet" href="css/ui.css" />
        <script>
          (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
          ga('create', 'UA-40245323-1', 'psychologie-urbania.com');
          ga('send', 'pageview');
        </script>
        <xsl:text disable-output-escaping="yes"><![CDATA[<script type="text/javascript" src="jquery/jquery-1.7.2.min.js"></script>]]></xsl:text>
        <xsl:text disable-output-escaping="yes"><![CDATA[<script type="text/javascript" src="jquery/jquery.elipsis.min.js"></script>]]></xsl:text>
        <script type="text/javascript">
          $(function () {
          $('.member-description').ellipsis();
          });
          $( window ).resize(function() {
          $('.member-description').ellipsis();
          });
        </script>
      </head>
      <body>
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
            <div class="cf">
              <div class="header">
                <h3>
                  <span>Notre équipe</span>
                </h3>
              </div>
            </div>

            <xsl:variable name="lastColumn">
              <xsl:value-of select="count(Member)-1" />
            </xsl:variable>

            <!-- Write each members -->
            <xsl:for-each select="Member">
              <xsl:variable name="index">
                <xsl:value-of select="position()-1" />
              </xsl:variable>
          <xsl:variable
                name="column">
                <xsl:value-of select="$index mod 2" />
              </xsl:variable>
          <xsl:if
                test="$column = 0">
                <xsl:text disable-output-escaping="yes"><![CDATA[<div class="cf"><div class="col1_50_50 section cf memberIntroRow2Col">]]></xsl:text>
            <xsl:call-template
                  name="WriteMember" />
            <xsl:text disable-output-escaping="yes"><![CDATA[</div>]]></xsl:text>
              </xsl:if>
          <xsl:if
                test="$column = 1">
                <xsl:text disable-output-escaping="yes"><![CDATA[<div class="col2_50_50 section cf memberIntroRow2Col">]]></xsl:text>
            <xsl:call-template
                  name="WriteMember" />
            <xsl:text disable-output-escaping="yes"><![CDATA[</div></div>]]></xsl:text>
              </xsl:if>
            </xsl:for-each>

            <!-- Close class="cf" from index 0 -->
            <xsl:if test="$lastColumn mod 2 = 0">
              <xsl:text disable-output-escaping="yes"><![CDATA[</div>]]></xsl:text>
            </xsl:if>
            <hr />
            <div class="sectiontext copyright">
              Copyright 2026 © Clinique de Psychologie Urbania. Tous droits réservés.
            </div>
          </div>
        </div>
        <!-- Google Code for team Conversion Page -->
        <script type="text/javascript">
          /* <![CDATA[ */
          var google_conversion_id = 1040801619;
          var google_conversion_language = "en";
          var google_conversion_format = "3";
          var google_conversion_color = "ffffff";
          var google_conversion_label = "9T4sCKnrhgUQ076l8AM";
          var google_conversion_value = 0;
          /* ]]> */
        </script>
        <script type="text/javascript" src="//www.googleadservices.com/pagead/conversion.js">
        </script>
        <noscript>
          <div style="display:inline;">
            <img height="1" width="1" style="border-style:none;" alt=""
              src="//www.googleadservices.com/pagead/conversion/1040801619/?value=0&amp;label=9T4sCKnrhgUQ076l8AM&amp;guid=ON&amp;script=0" />
          </div>
        </noscript>
      </body>
    </html>
  </xsl:template>

  <!-- Write a member HTML -->
  <xsl:template name="WriteMember">
    <xsl:variable name="summary" select="Language[@code=$argLanguageCode]/Summary" />
    <xsl:variable
      name="academic" select="Language[@code=$argLanguageCode]/Academic" />
    <xsl:text
      disable-output-escaping="yes"><![CDATA[<a href="]]></xsl:text><xsl:value-of select="PageName" /><xsl:text
      disable-output-escaping="yes"><![CDATA[">]]></xsl:text><xsl:text disable-output-escaping="yes"><![CDATA[<img src="]]></xsl:text><xsl:value-of
      select="Photo" /><xsl:text disable-output-escaping="yes"><![CDATA["/>]]></xsl:text><xsl:text
      disable-output-escaping="yes"><![CDATA[</a>]]></xsl:text>
    <div class="member-description">
      <h3>
        <span>
          <xsl:text disable-output-escaping="yes"><![CDATA[<a href="]]></xsl:text>
          <xsl:value-of select="PageName" />
          <xsl:text disable-output-escaping="yes"><![CDATA[">]]></xsl:text>
          <xsl:value-of select="Name" />
          <xsl:text disable-output-escaping="yes"><![CDATA[</a>]]></xsl:text>
        </span>
      </h3>
      <h1>
        <span>
          <xsl:value-of select="$academic" />
        </span>
      </h1>
      <p>
        <span>
          <xsl:value-of select="$summary" />
        </span>
      </p>
    </div>
    <xsl:text
      disable-output-escaping="yes"><![CDATA[<div class="detailLink memberLink"><a href="]]></xsl:text><xsl:value-of select="PageName" /><xsl:text
      disable-output-escaping="yes"><![CDATA[">détails</a></div>]]></xsl:text>
  </xsl:template>


</xsl:stylesheet>