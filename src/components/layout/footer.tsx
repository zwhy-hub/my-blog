import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 px-4 py-8 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} My Blog. All rights reserved.</p>
        <div className="flex gap-4">
          <Link href="/admin" className="hover:text-foreground transition-colors">
            管理后台
          </Link>
          <Link href="/feed.xml" className="hover:text-foreground transition-colors">
            RSS
          </Link>
        </div>
      </div>
    </footer>
  );
}
