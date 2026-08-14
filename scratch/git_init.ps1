$git = "C:\Program Files\Git\cmd\git.exe"
& $git init
& $git add .
& $git commit -m "First commit: TotalFlexWeb implementation"
& $git branch -M main
& $git remote add origin https://github.com/juanpabloortiz01/TotalFlexWeb.git
& $git push -u origin main
