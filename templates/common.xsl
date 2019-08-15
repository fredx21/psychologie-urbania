<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
  <xsl:output method="html"/>

  <xsl:variable name="pipe"><xsl:text disable-output-escaping="yes"><![CDATA[|]]></xsl:text></xsl:variable>
  <xsl:variable name="linefeed"><xsl:text disable-output-escaping="yes"><![CDATA[<br/>]]></xsl:text></xsl:variable>

  <xsl:template name="replace-linefeed">
    <xsl:param name="text"/>
    <xsl:call-template name="replace-string">
      <xsl:with-param name="text" select="$text" />
      <xsl:with-param name="replace" select="$pipe" />
      <xsl:with-param name="with" select="$linefeed" />
    </xsl:call-template>
  </xsl:template>

  <xsl:template name="replace-string">
    <xsl:param name="text"/>
    <xsl:param name="replace"/>
    <xsl:param name="with"/>
    <xsl:choose>
      <xsl:when test="contains($text,$replace)">
        <xsl:value-of select="substring-before($text,$replace)"/>
        <xsl:value-of select="$with" disable-output-escaping="yes"/>
        <xsl:call-template name="replace-string">
          <xsl:with-param name="text" select="substring-after($text,$replace)"/>
          <xsl:with-param name="replace" select="$replace"/>
          <xsl:with-param name="with" select="$with"/>
        </xsl:call-template>
      </xsl:when>
      <xsl:otherwise>
        <xsl:value-of select="$text"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

</xsl:stylesheet>