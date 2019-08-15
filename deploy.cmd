set OF=ftpcmdfile.txt

echo open ftp.psychologie-urbania.com> %OF%
echo psycholo>> %OF%
echo ax0q8q19AP>> %OF%
echo. >> %OF%
echo bin >> %OF%
echo hash on >> %OF%

echo cd public_html >> %OF%
echo lcd site >> %OF%
echo prompt >> %OF%
echo mput *.html >> %OF%

REM echo lcd img >> %OF%
REM echo cd img >> %OF%
REM echo mput *.* >> %OF%

echo lcd .. >> %OF%
echo lcd css >> %OF%
echo cd .. >> %OF%
echo cd css >> %OF%
echo mput *.* >> %OF%

echo quit >> %OF%

ftp -s:%OF%
del %OF%
